const sortFriends = (a, b) => {
  const al = a.messages.length
  const bl = b.messages.length
  if (!al && !bl) {
    return -1
  }
  if (!al && bl) {
    return 1
  }
  if (al && !bl) {
    return -1
  }
  if (a.messages[al - 1].time > b.messages[bl - 1].time) {
    return -1
  }
  return 1
}

export const reducer = (state, action) => {
  if (action.type === 'SEARCH_FRIEND') {
    const result = state.friends.filter((friend) =>
      //returning only friends whose name starts with search value
      friend.username.startsWith(action.payload),
    )
    return { ...state, friends: result, friend: action.payload }
  }
  if (action.type === 'USER_SEARCH') {
    return { ...state, otherUsers: [...action.payload], loadingUsers: false }
  }
  if (action.type === 'LOADING_USERS') {
    return { ...state, loadingUsers: true }
  }
  if (action.type === 'UPDATE_FRIENDS') {
    const friends = [...state.friends, action.payload]
    friends.sort(sortFriends)
    return {
      ...state,
      friends,
      chatWith: 0,
    }
  }
  if (action.type === 'ADD_FRIEND') {
    let newFriend
    const otherUsers = state.otherUsers.filter((user) => {
      if (user.username === action.payload) {
        newFriend = user
        return
      }
      return user
    })
    return {
      ...state,
      friends: [...state.friends, { ...newFriend, messages: [] }],
      otherUsers: [...otherUsers],
    }
  }
  if (action.type === 'CHAT_WITH') {
    return { ...state, chatWith: action.payload }
  }
  if (action.type === 'SEND_MESSAGE') {
    const { message, to, from } = action.payload
    const friends = state.friends.map((friend) => {
      if (friend.username === to) {
        const time = new Date()
        return {
          ...friend,
          messages: [
            ...friend.messages,
            {
              msg: message,
              sender: from,
              time: time.getTime(),
              createdAt: time,
            },
          ],
        }
      }
      return friend
    })
    friends.sort(sortFriends)
    return { ...state, friends }
  }
  if (action.type === 'RECIEVE_MESSAGE') {
    const { message } = action.payload
    // console.log(message)
    const friends = state.friends.map((friend) => {
      if (friend.username === message.sender) {
        return { ...friend, messages: [...friend.messages, message] }
      }
      return friend
    })
    friends.sort(sortFriends)
    return { ...state, friends }
  }
  if (action.type === 'TYPING') {
    const username = action.payload
    const friends = state.friends.map((friend) => {
      if (friend.username === username) {
        return { ...friend, typing: true }
      }
      return friend
    })
    return { ...state, friends }
  }
  if (action.type === 'STOP_TYPING') {
    const username = action.payload
    const friends = state.friends.map((friend) => {
      if (friend.username === username) {
        return { ...friend, typing: false }
      }
      return friend
    })
    return { ...state, friends }
  }
  if (action.type === 'SEEN') {
    const ids = []
    const friends = state.friends.map((friend) => {
      if (friend.username === action.payload.from) {
        const messages = friend.messages.map((message) => {
          if (!message.seen && message.sender === action.payload.from) {
            ids.push(message._id)
            return { ...message, seen: true }
          }
          return message
        })
        return { ...friend, messages }
      }
      return friend
    })
    if (ids.length) {
      state.socket.emit('seen', {
        ids,
        to: action.payload.to,
        from: action.payload.from,
      })
    }
    return { ...state, friends }
  }

  return state
}
