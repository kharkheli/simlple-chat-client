import React, { useState, useReducer, useEffect } from 'react'
import { useGlobalContext } from '../context'
import Greeting from '../Greeting'
import { BsSearch } from 'react-icons/bs'
import Friend from './Friend'
import MessageArea from './MessageArea'
import { io } from 'socket.io-client'
import axios from 'axios'
import OtherUsers from './OtherUsers'
import { reducer } from './reducer'

const socket = io('http://localhost:3001/', { autoConnect: false })

const defaultState = {
  friends: [],
  friend: '',
  socket,
  otherUsers: [],
  loadingUsers: false,
  chatWith: {},
}

function Chat() {
  const { user } = useGlobalContext()
  const [state, dispatch] = useReducer(reducer, defaultState)
  const [chatWith, setChatWith] = useState({})

  useEffect(() => {
    for (const friend of user.friends) {
      axios
        .get(`http://localhost:3001/user/${friend}?requester=${user.username}`)
        .then((res) => {
          dispatch({
            type: 'UPDATE_FRIENDS',
            payload: { ...res.data.user, messages: res.data.messages },
          })
        })
    }
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
                dispatch({ type: 'CHAT_WITH', payload: { ...friend } })
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
        <MessageArea {...state.chatWith} />
      </div>
    </div>
  )
}

export default Chat
