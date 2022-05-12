import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    author: { type: String, required: true },
    titleimage: { type: String, nullable: true, default: '' },
    title: { type: String, required: true, unique: true },
    subtitle: { type: String, nullable: true, default: '' },
    description: { type: String, nullable: true, default: '' },
    comments: [{ comment: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs: Number
    }
  },
  {
    timestamps: true
  },
  {
    collection: 'posts'
  }
);

const Post = model("posts", postSchema);

export default Post