import React, { useState, useReducer, useEffect } from 'react'
import { useGlobalContext } from '../context'
import Greeting from '../Greeting'
import { BsSearch } from 'react-icons/bs'
import Friend from './Friend'
import MessageArea from './MessageArea'
import { io } from 'socket.io-client'
import axios from 'axios'
import OtherUsers from './OtherUsers'

const reducer = (state, action) => {
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
    return { ...state, friends: action.payload }
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
  return state
}

const socket = io('http://localhost:3001/', { autoConnect: false })

const defaultState = {
  friends: [],
  friend: '',
  socket,
  otherUsers: [],
  loadingUsers: false,
}

function Chat() {
  const { user } = useGlobalContext()
  const [state, dispatch] = useReducer(reducer, defaultState)
  const [chatWith, setChatWith] = useState({})

  useEffect(async () => {
    const friends = []
    for (const friend of user.friends) {
      axios
        .get(`http://localhost:3001/user/${friend}?requester=${user.username}`)
        .then((res) => {
          friends.push({ ...res.data.user, messages: res.data.messages })
        })
    }
    dispatch({ type: 'UPDATE_FRIENDS', payload: friends })
    setChatWith(state.friends[0])
  }, [])
  useEffect(async () => {
    dispatch({ type: 'LOADING_USERS' })
    axios
      .get(
        `http://localhost:3001/user?starter=${state.friend}&username=${user.username}`,
      )
      .then((res) => {
        dispatch({ type: 'USER_SEARCH', payload: res.data })
      })
  }, [state.friend])
  return (
    <div className="chat">
      <Greeting />
      <aside className="friend-list">
        <div className="friend-search">
          <i>
            <BsSearch />
          </i>
          <input
            className="search-box"
            type="text"
            placeholder="Search for friend"
            value={state.friend}
            onChange={(e) =>
              //instead of creating use state and usefect which runs every time
              // search changes and filters friends using dispatch it cann happen
              //att the same time
              dispatch({ type: 'SEARCH_FRIEND', payload: e.target.value })
            }
          />
        </div>
        <h1>Friends</h1>
        {state.friends.map((friend, index) => {
          return (
            <div
              key={friend.username}
              onClick={() => {
                setChatWith({ ...friend })
              }}
            >
              <Friend {...friend} />
            </div>
          )
        })}
        <h1>Other Users</h1>
        {state.loadingUsers ? (
          <h3>Loading...</h3>
        ) : (
          state.otherUsers.map((other, index) => {
            return (
              <div key={other.username}>
                <OtherUsers
                  user={{ ...other, theGuy: user.username }}
                  dispatch={dispatch}
                />
              </div>
            )
          })
        )}
      </aside>
      <div className="message-area-cont">
        <MessageArea {...chatWith} />
      </div>
    </div>
  )
}

export default Chat
