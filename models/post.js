import  mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image_path: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  edited_at: { type: Date, default: null }
});

export const Post = mongoose.model('Post', PostSchema);