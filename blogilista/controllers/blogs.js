const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { response } = require('../app')

blogsRouter.get('/', async (request, response) => {
  await Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if(!blog.title || blog.title==='' || !blog.url || blog.url===''){
    response.status(400).end()
  } else {
    await blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => console.log(error))
})


blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => console.log('error ',error))
})


module.exports = blogsRouter