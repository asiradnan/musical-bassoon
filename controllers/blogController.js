import asyncHandler from 'express-async-handler';
import Blog from '../models/blogModel.js';

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  // Only show published blogs to public
  const filter = { ...keyword, published: true };

  const count = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', 'name');

  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, image, category, tags, published } = req.body;

  const blog = new Blog({
    title,
    content,
    image: image || '/images/sample.jpg',
    category,
    tags: tags || [],
    published: published !== undefined ? published : true,
    user: req.user._id,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, image, category, tags, published } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.published = published !== undefined ? published : blog.published;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
const getBlogsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  
  const blogs = await Blog.find({ 
    category,
    published: true 
  }).populate('user', 'name').sort({ createdAt: -1 });
  
  if (blogs.length === 0) {
    res.status(404);
    throw new Error(`No blogs found in category: ${category}`);
  }
  
  res.json(blogs);
});

export {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
};