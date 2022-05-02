import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const mindmapSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    owner: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    originalMap: { type: String, required: true },
    currentMap: { type: String, required: true },
    mapimage: { type: String, default: '' },
    editinghistory: [new Schema({
      updated: { type: Date, default: Date.now, required: true },
      editedMap: { type: String, required: true },
    })],
  },
  {
    timestamps: true
  },
  {
    collection: 'mindmaps'
  }
);
const Mindmap = model("mindmaps", mindmapSchema);
export default Mindmap