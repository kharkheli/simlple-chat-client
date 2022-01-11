export const reducer = (state, action) => {
  if (action.type === 'SEND_MESSAGE') {
    return {
      ...state,
      messages: [
        ...state.messages,
        { state: 'sender', msg: action.payload, time: '12:27' },
      ],
    }
  }
  if (action.type === 'MESSAGE_RECIEVED') {
    return {
      ...state,
      messages: [
        ...state.messages,
        { state: 'reciever', msg: action.payload.message, time: '12:27' },
      ],
    }
  }
  if (action.type === 'RESET') {
    return { ...action.payload }
  }
  return state
}
