import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    owner: { type: String, default: '' },
  },
  {
    timestamps: true
  },
  {
    collection: 'tags'
  }
);
const Tag = model("tags", tagSchema);
export default Tag