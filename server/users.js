import { uid } from 'uid'

const users = {}

export const getBoardId = (id) => users[id]

export const newUser = (boardId) => {
  const userId = uid(10)
  users[userId] = boardId
  return userId
}
