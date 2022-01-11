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
    return {
      ...state,
      friends: [...state.friends, action.payload],
      chatWith: state.friends[0] || action.payload,
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
      friends: [...state.friends, newFriend],
      otherUsers: [...otherUsers],
    }
  }
  if (action.type === 'CHAT_WITH') {
    return { ...state, chatWith: action.payload }
  }
  return state
}
