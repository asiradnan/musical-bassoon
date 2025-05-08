import mongoose from 'mongoose';

const blogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Music Tips', 'Studio Updates', 'Instrument Care', 'Industry News', 'Events'],
      required: true,
    },
    tags: [String],
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;