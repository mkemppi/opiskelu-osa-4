const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Testaaminen on mälsää',
    author: 'Mikko Kemppi',
    url: 'https://www.tahko.com',
    likes: 123,
  },
  {
    title: 'Testaaminen voi olla kivaakin',
    author: 'Teuvo Oinas',
    url: 'https://www.tangofestivaalit.com',
    likes: 8123,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('Blogien hakeminen', () => {
  test('Blogit palautetaan json muodossa', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Kaikki blogit palautetaan', async () => {
    const response = await api.get('/api/blogs')
    //console.log("blogs",response.body)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('Viestin identifioiva id kenttä löytyy', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('Viesteistä löytyy tietty viesti', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain('Testaaminen on mälsää')
  })
})
describe('Blogin muokkaaminen', () => {
  test('Blogin lisääminen onnistuu', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Test',
      url: 'http://eeee',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    //const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    /*expect(contents).toContain(
      'async/await simplifies making async calls'
    )*/
  })

  test('Blogijutun lisääminen ilman sisältöä ei onnistu', async () => {
    const newBlog = {
      author: 'Mikko'
    }
    const allBlogsBefore = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const allBlogsAfter = await api.get('/api/blogs')

    expect(allBlogsAfter.body).toHaveLength(allBlogsBefore.body.length)
  })
})

describe('Blogin poistaminen', () => {

  test('Palauttaa statuksen 204 mikäli toimii ja blogien lukumäärä vähenee yhdellä', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    expect(blogsAtEnd.body).toHaveLength(
      blogsAtStart.body.length - 1
    )
  })
})
describe('Blogin muokkaaminen', () => {

  test('Palauttaa statuksen 200 json muotoisena ja blogia on muokattu', async () => {
    const modBlog = {
      title: 'Jeeejee testi',
      author: 'Mikko K',
      url: 'https://www.w.w',
      likes: 100000
    }
    const blogsAtStart = await api.get('/api/blogs')
    const blogToModify = blogsAtStart.body[0]

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(modBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    //console.log('blogsAtEnd', blogsAtEnd)
    expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length)

    const contents = blogsAtEnd.body.map(r => r.title)
    expect(contents).toContain('Jeeejee testi')
  })
})

afterAll(() => {
  mongoose.connection.close()
})