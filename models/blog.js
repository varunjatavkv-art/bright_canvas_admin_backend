import  mongoose from 'mongoose';
const blogSchema = new mongoose.Schema({ 
  title: { type: String, required: true }, 
  content: { type: String, required: true }, // HTML or Markdown 
  imageUrl: { type: String }, 
  tags: [String], 
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' // CRITICAL 
  }, 
  generatedBy: { type: String, default: 'n8n-bot' }, 
  createdAt: { type: Date, default: Date.now }, 
  publishedAt: Date 
}); 
 
export const Blog = mongoose.model('Blog', blogSchema);