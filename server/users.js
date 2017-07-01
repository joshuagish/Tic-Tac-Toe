const uid = require('uid')

var users = {}

const getBoardId = (id) => {
  return users[id]
}

const newUser = (boardId) => {
  let userId = uid(10)
  users[userId] = boardId
  return userId
}

module.exports = {
  newUser,
  getBoardId
}
