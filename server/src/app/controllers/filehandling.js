import mongoose from 'mongoose';
import sharp from 'sharp'

import Tags from '../../components/database/models/file.model.js'

const streamToString = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  })
}

export const storeFile = async (upload, owner, title, description, tags) => {
  const { createReadStream, filename, mimetype, encoding } = await upload.promise;
  console.log('storeFile upload filename', filename)

  // Check contentType
  let base64Thumbnail = null
  if(
    mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || 
    mimetype === "application/zip" || 
    mimetype === "text/plain" || 
    mimetype === "application/msword" || 
    mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
    mimetype === "application/pdf"
  ) base64Thumbnail = null
  else {
    const image = await streamToString(createReadStream())
    const sharpImage = await sharp(image)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer()
    base64Thumbnail = await `data:image/jpeg;base64,${sharpImage.toString('base64')}`
  }
  //console.log('storeFile resizedFile', base64Thumbnail)

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'upload' })
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: mimetype,
    metadata: {
      owner,
      title,
      description,
      encoding,
      thumbnail: base64Thumbnail,
      tags,
    }
  });

  return new Promise((resolve, reject) => {
    createReadStream()
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => {
        const { id, filename, length, } = uploadStream
        console.log('uploadStream', id.toString(), filename, length)

        resolve({
          id: id.toString(),
          filename,
          length,
          mimetype: mimetype,
          encoding: encoding,
        })
      })
  })



  //const { filename, createReadStream, mimetype } = await upload.then(result => result);
  //const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'files' });

  // const uploadStream = bucket.openUploadStream(filename, {
  //   contentType: mimetype
  // });
  // return new Promise((resolve, reject) => {
  //   createReadStream()
  //     .pipe(uploadStream)
  //     .on('error', reject)
  //     .on('finish', () => {
  //         resolve(uploadStream.id)
  //     })
  // })
}

export const downloadFile = async (fileId) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'upload', });
  return new Promise((resolve, reject) => {
    // temporary variable to hold image
    var data = [];

    // create the download stream
    const ObjectID = mongoose.Types.ObjectId;
    const readstream = bucket.openDownloadStream(new ObjectID(fileId));
    readstream.on('data', function (chunk) {
      data.push(chunk);
    });
    readstream.on('error', async (error) => {
      reject(error);
    });
    readstream.on('end', async () => {
      let bufferBase64 = Buffer.concat(data);
      const img = bufferBase64.toString('base64');
      resolve(img);
    });
  });
};