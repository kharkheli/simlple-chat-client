import axios from 'axios'
import Friend from './Friend'

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
    return { ...state, friend: action.payload }
  }
  if (action.type === 'USER_SEARCH') {
    return { ...state, otherUsers: [...action.payload], loadingUsers: false }
  }
  if (action.type === 'LOADING_USERS') {
    return { ...state, loadingUsers: true }
  }
  if (action.type === 'UPDATE_FRIENDS') {
    // const friends = [...state.friends, action.payload]
    // friends.sort(sortFriends)
    return {
      ...state,
      // friends,
      friendsv1: {
        ...state.friendsv1,
        [action.payload.username]: action.payload,
      },
    }
  }
  if (action.type === 'BECOME_FRIEND') {
    const otherUsers = state.otherUsers.filter(
      (user) => user.username !== action.payload.username,
    )
    const friend = { ...action.payload, messages: [], active: true }
    state.friendsv1[action.payload.username] = { ...friend }
    return {
      ...state,
      // friends: [...state.friends, friend],
      otherUsers: [...otherUsers],
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
    state.friendsv1[action.payload] = { ...newFriend, messages: [] }
    return {
      ...state,
      otherUsers: [...otherUsers],
    }
  }
  if (action.type === 'CHAT_WITH') {
    return {
      ...state,
      chatWith: action.payload || state.friends[0].username || undefined,
    }
  }
  if (action.type === 'SEND_MESSAGE') {
    const { message, to, from } = action.payload
    const time = new Date()
    state.friendsv1[to].messages = [
      ...state.friendsv1[to].messages,
      {
        msg: message,
        sender: from,
        time: time.getTime(),
        createdAt: time,
      },
    ]
    return { ...state }
  }
  if (action.type === 'RECIEVE_MESSAGE') {
    const { message } = action.payload
    // // console.log(message)
    state.friendsv1[message.sender].messages = [
      ...state.friendsv1[message.sender].messages,
      message,
    ]

    return { ...state }
  }
  if (action.type === 'TYPING') {
    const username = action.payload
    if (username in state.friendsv1) {
      state.friendsv1[username].typing = true
    }

    return { ...state }
  }
  if (action.type === 'STOP_TYPING') {
    const username = action.payload
    if (username in state.friendsv1) {
      state.friendsv1[username].typing = false
    }

    return { ...state }
  }
  if (action.type === 'SEEN') {
    const ids = []
    const sender = action.payload.from
    // for now it is not optimized it will lopp through all loaded messages to see
    // if they are seen or not when i can be looped in reverse and break when come across
    // first seen message
    state.friendsv1[sender].messages = state.friendsv1[sender].messages.map(
      (message) => {
        if (message.sender === sender && !message.seen) {
          ids.push(message._id)
          return { ...message, seen: true }
        }
        return message
      },
    )
    if (ids.length) {
      state.socket.emit('seen', {
        ids,
        to: action.payload.to,
        from: action.payload.from,
      })
    }
    return { ...state }
  }
  if (action.type === 'LOAD_FRIENDS') {
    const friendsv1 = {}
    const { friends, recent } = action.payload

    friends.map((friend) => {
      friendsv1[friend.user.username] = {
        ...friend.user,
        messages: friend.messages,
      }
    })
    let chatWith = state.chatWith || recent
    return {
      ...state,
      chatWith,
      friendsv1: { ...state.friendsv1, ...friendsv1 },
    }
  }

  if (action.type === 'ACTIVE_USERS') {
    const activeFriends = action.payload
    for (let friend of activeFriends) {
      if (friend in state.friendsv1) {
        state.friendsv1[friend].active = true
      }
    }

    return { ...state }
  }

  if (action.type === 'USER_CONNECTED') {
    const username = action.payload
    if (username in state.friendsv1) {
      state.friendsv1[username].active = true
    }
    return { ...state }
  }
  if (action.type === 'USER_DISCONNECTED') {
    const username = action.payload
    if (username in state.friendsv1) {
      state.friendsv1[username].active = false
      state.friendsv1[username].typing = false
    }

    return { ...state }
  }
  // if (action.type === 'CHECK_SENDER') {
  //   const { sender, friends, setUser, user } = action.payload
  //   let newFriend
  //   if (!friends.includes(sender)) {
  //     axios
  //       .get(`http://localhost:3001/user/${sender}?requester=${user.username}`)
  //       .then((res) => {
  //         newFriend = { ...res.data.user, messages: res.data.messages }
  //       })
  //   }
  //   // console.log(newFriend)
  // }

  return state
}
