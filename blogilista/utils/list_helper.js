var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, b) => sum + b.likes,0)

const favoriteBlog = (blogs) => {
  const bestBlog = blogs.reduce((best, b) => {
    //console.log('tykkääjät',b.likes,best)
    return (b.likes > best) ? b.likes : best
  },0)
  //console.log('mostlikes',bestBlog)
  return blogs.find((b) => b.likes === bestBlog)
}

const mostBlogs = (blogs) => {

  const grouped = _.map(
    _.countBy(blogs, 'author'), (val, key) => (
      { author: key, blogs: val }
    )
  )

  const mostBlog = grouped.reduce((most, b) => {
    //console.log('tykkääjät',b.likes,best)
    return (b.blogs > most) ? b.blogs : most
  },0)

  return grouped.find((b) => b.blogs === mostBlog)

}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}