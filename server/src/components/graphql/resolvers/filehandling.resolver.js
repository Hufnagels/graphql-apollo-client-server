import _ from 'lodash'
import { ApolloError, UserInputError } from 'apollo-server-express'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { finished } from 'stream/promises'
import GridFS from 'gridfs-stream'
import mongoose from 'mongoose';
import sharp from 'sharp'

import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'
import Files from '../../database/models/file.model.js'
import Tags from '../../database/models/tag.model.js'
import { storeFile, downloadFile } from '../../../app/controllers/filehandling.js'

const FilehandlingResolver = {
  Upload: GraphQLUpload,
  Query: {
    getFiles: async (_, args) => {
      const { search, page = 1, limit = 10 } = args;
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { "filename": { $regex: search, $options: 'i' } },
            { "metadata.title": { $regex: search, $options: 'i' } },
            { "metadata.description": { $regex: search, $options: 'i' } },
            { "metadata.tags": { $regex: search, $options: 'i' } }
          ]
        }
      }
      const count = await Files.countDocuments(searchQuery);

      if (!count) return {
        files: [],
        totalPages: 0,
        currentPage: 0,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page
      console.log('UPLOAD Resolver totalPages', totalPages, correctedPage)
      const files = await Files.find(searchQuery)
        .sort({ uploadDate: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        files: count > 0 ? files : [],
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getFile: async (_, args) => {
      const { _id } = args;
      //const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'upload' })
      const fileRecord = await Files.findById(_id)
      if (!fileRecord) throw new Error(`The file with the id ${_id} does not exist.`)
      const img = await downloadFile(_id)
      const { filename, uploadDate, contentType, length, chunkSize, metadata } = fileRecord.toObject()
      //console.log('download', filename, uploadDate, contentType, length, chunkSize, metadata)

      return {
        filename, uploadDate, contentType, length, chunkSize, metadata,
        file: img,
      }

      return
      // const fileRecord = await Files.findById(_id)


      return fileRecord
    }
  },
  Mutation: {
    singleUpload: async (_, { file, title, description }, context, info) => {
      const user = await checkSignedIn(context.req, true)
      const { email } = user
      console.log('UPLOAD Resolver singleUpload', title, description)

      const fileId = await storeFile(file, email, title, description).then(result => result);

      return { fileId }
    },
    multipleUpload: async (_, { files, title, description, tags }, context, info) => {
      if (files.length === 0) throw new UserInputError('No files selected')
      const user = await checkSignedIn(context.req, true)
      const { email } = user
      tags = JSON.parse(tags)
      let fileIDs = []
      console.log('UPLOAD Resolver multipleUpload title, description', title, description, tags)
      console.log('UPLOAD Resolver multipleUpload files', files)
      console.log('UPLOAD Resolver multipleUpload tags', tags, tags.length)
      // Create taglist for bulkwrite
      if (tags.length > 0) {
        const tagList = tags.map(tag => {
          return {
            title: tag,
            owner: email,
          }
        })
        console.log('UPLOAD Resolver multipleUpload tagList', tagList)

        let tagsUpdate = tagList.map(tag => ({
          updateOne: {
            filter: { title: tag.title, owner: tag.owner },
            update: { $set: tag },
            upsert: true
          }
        }))
        // await Tags.bulkWrite(tagsUpdate).catch(e => {
        //   console.log('Tags.bulkWrite', e);
        //   throw new UserInputError('Taglist update failed')
        // })
        try {
          let result = await new Promise((resolve, reject) => {

            Tags.bulkWrite(tagsUpdate, (err, r) => {
              if (err) reject(err);
              resolve(r);
            });
          });
          console.log('UPLOAD Resolver multipleUpload result', JSON.stringify(result, undefined, 2));
          console.log("UPLOAD Resolver multipleUploadr Success!");
        } catch (e) {
          console.log("UPLOAD Resolver multipleUpload Failed:");
          console.log(e);
        }
      }

      // Update tags with _id and insert to metadata

      for (const file of files) {
        const fileId = await storeFile(file, email, title, description, tags).then(result => result)
        fileIDs.push(fileId)
      }

      // await Promise.all(files.map(async (file) => {
      //   const contents = await storeFile(file, email, title, description).then(result => result)
      //   fileIDs.push(contents)
      //   console.log(contents)
      // }));
      //const fileId = await storeFile(file, email, title, description).then(result => result);
      console.log('UPLOAD Resolver multipleUpload fileIDs', fileIDs)
      return { fileIDs }
    },
    deleteFile: async (_, { _id }, context) => {
      const user = await checkSignedIn(context.req, true)
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'upload' })
      const obj_id = new mongoose.Types.ObjectId(_id)
      try {
        bucket.delete(obj_id);
        return true
      } catch (e) {
        throw new UserInputError('Delete not success')
      }


    }
  },
}

export default FilehandlingResolver

