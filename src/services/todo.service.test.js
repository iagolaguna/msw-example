import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { getTodoById } from './todo.service.js'
const server = setupServer(
  rest.get(
    'https://jsonplaceholder.typicode.com/todos/:id',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false
        })
      )
    }
  )
)
describe('TodoService', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  test('should get the correct value from root handler', async () => {
    const result = await getTodoById(1)

    expect(result).toBe(
      expect.objectContaining({
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false
      })
    )
  })

  test('should get the correct value from internal handler', async () => {
    rest.get(
      'https://jsonplaceholder.typicode.com/todos/:id',
      (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            userId: 2,
            id: 2,
            title: 'Inner Handler',
            completed: false
          })
        )
      }
    )

    const result = await getTodoById(1)

    expect(result).toBe(
      expect.objectContaining({
        userId: 2,
        id: 2,
        title: 'Inner Handler',
        completed: false
      })
    )
  })
})
