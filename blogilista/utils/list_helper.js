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

module.exports = {
  dummy, totalLikes, favoriteBlog
}