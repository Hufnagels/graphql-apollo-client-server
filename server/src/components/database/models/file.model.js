import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const fileSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    // owner: { type: String, required: true },
    // title: { type: String, required: true },
    // description: { type: String, default: '' },
    path: { type: String, default: '' },
    filename: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    encoding: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    metadata: { type: Object }
  },
  {
    timestamps: true
  },
  {
    collection: 'upload'
  }
);
const File = model("upload.files", fileSchema);
export default File

/*
const fileSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    length: { type: Number, default: 0 },
    chunkSize: { type: Number, default: 0 },
    uploadDate: { type: String, default: '' },
    filename: { type: String, default: '' },
    contentType: { type: String, default: '' },
    metadata: { type: String, default: '' },
  },
  {
    timestamps: true
  },
  {
    collection: 'files.files'
  }
);
const File = model("files.files", fileSchema);
export default File
*/