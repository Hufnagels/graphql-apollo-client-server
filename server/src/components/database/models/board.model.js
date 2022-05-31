import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const boardSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    board: { type: String },
    boardimage: { type: String, default: '' },
    editinghistory: [new Schema({
      updated: { type: Date, default: Date.now, required: true },
      editedMap: { type: String, required: true },
    })],
  },
  {
    timestamps: true
  },
  {
    collection: 'boards'
  }
);
const Board = model("boards", boardSchema);
export default Board