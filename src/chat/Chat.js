import React, { useRef, useReducer, useEffect, useState } from 'react'
import { useGlobalContext } from '../context'
import { BsSearch } from 'react-icons/bs'
import Friend from './Friend'
import MessageArea from './MessageArea'
import { io } from 'socket.io-client'
import axios from 'axios'
import OtherUsers from './OtherUsers'
import { reducer } from './reducer'
import msgSound from '../message1.mp3'
import { RiArrowLeftSLine } from 'react-icons/ri'

const socket = io('http://localhost:3001', {
  autoConnect: false,
})

const defaultState = {
  friends: [], // this is a huge mistake it should be an object
  // i am on the way to fix it
  friend: '',
  socket,
  otherUsers: [],
  loadingUsers: false,
  chatWith: undefined,
}

function Chat() {
  const [showFriends, setShowFriends] = useState(false)
  const [load, setLoad] = useState(1)
  const [loadingFriends, setLoadingFriends] = useState(false)
  const sound = useRef(null)
  const { user, setUser } = useGlobalContext()
  const [state, dispatch] = useReducer(reducer, defaultState)

  useEffect(async () => {
    // for (const friend of user.friends.slice(0, 10)) {
    //   await axios
    //     .get(`http://localhost:3001/user/${friend}?requester=${user.username}`)
    //     .then((res) => {
    //       dispatch({
    //         type: 'UPDATE_FRIENDS',
    //         payload: { ...res.data.user, messages: res.data.messages },
    //       })
    //     })
    // }
    setLoadingFriends(true)
    axios
      .get('http://localhost:3001/user/friends', {
        params: {
          requester: user.username,
          usernames: user.friends.slice((load - 1) * 10, load * 10),
        },
      })
      .then((res) => {
        dispatch({ type: 'LOAD_FRIENDS', payload: res.data.friends })
        setLoadingFriends(false)
        socket.emit('active users', { username: user.username })
      })
    // dispatch({ type: 'CHAT_WITH' })
  }, [load])
  useEffect(async () => {
    const listed = []
    socket.auth = { username: user.username }
    socket.connect()
    socket.onAny((event, ...args) => {
      // console.log(event, args)
    })

    socket.on('user connected', (data) => {
      // console.log(data)
      dispatch({ type: 'USER_CONNECTED', payload: data.user })
    })
    socket.on('user disconnected', (data) => {
      // console.log(data)
      dispatch({ type: 'USER_DISCONNECTED', payload: data.user })
    })
    socket.on('message sent', async (data) => {
      const friends = user.friends.slice((load - 1) * 10, load * 10)

      if (![...listed, ...friends].includes(data.message.sender)) {
        axios
          .get(
            `http://localhost:3001/user/${data.message.sender}?requester=${user.username}`,
          )
          .then((res) => {
            dispatch({
              type: 'UPDATE_FRIENDS',
              payload: { ...res.data.user, messages: res.data.messages },
            })
            listed.push(data.message.sender)
          })
      }
      // dispatch({
      //   type: 'CHECK_SENDER',
      // payload: {
      //   sender: data.message.sender,
      //   friends: user.friends.slice((load - 1) * 10, load * 10),
      //   user,
      //   setUser,
      // },
      // })
      dispatch({ type: 'RECIEVE_MESSAGE', payload: data })
      sound.current.play()
    })

    socket.on('active users', (data) => {
      dispatch({ type: 'ACTIVE_USERS', payload: data.activeFriends })
    })

    socket.on('typing', (data) => {
      dispatch({ type: 'TYPING', payload: data })
    })
    socket.on('stop typing', (data) => {
      dispatch({ type: 'STOP_TYPING', payload: data })
    })
    socket.on('add friend', (data) => {
      listed.push(data.user.username)
      dispatch({ type: 'BECOME_FRIEND', payload: data.user })
    })
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
      {/* <Greeting /> */}
      <aside
        className={`friend-list ${showFriends ? 'show-friend-list' : null}`}
      >
        <div className="friend-search">
          <i>
            <BsSearch />
          </i>
          <audio controls ref={sound} style={{ display: 'none' }}>
            <source src={msgSound} />
          </audio>
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
        {state.friends
          .filter((friend) => friend.username.startsWith(state.friend))
          .map((friend, index) => {
            return (
              <div
                className={
                  state.chatWith === friend.username ? 'active-friend' : null
                }
                key={friend.username}
                onClick={() => {
                  dispatch({ type: 'CHAT_WITH', payload: friend.username })
                  setShowFriends(false)
                  dispatch({
                    type: 'SEEN',
                    payload: { from: friend.username, to: user.username },
                  })
                }}
              >
                <Friend {...friend} />
              </div>
            )
          })}
        {/* i coulnt have done load more on scroll because friends are followed
          other users and that would make no sense */}
        {loadingFriends ? (
          <h3 style={{ textAlign: 'center' }}>Loading...</h3>
        ) : (
          <h2 className="load-more" onClick={() => setLoad(load + 1)}>
            load more
          </h2>
        )}
        <h1>Other Users</h1>
        {state.loadingUsers ? (
          <h3 style={{ textAlign: 'center' }}>Loading...</h3>
        ) : (
          state.otherUsers.map((other, index) => {
            return (
              <div key={other.username}>
                <OtherUsers
                  user={{ ...other }}
                  dispatch={dispatch}
                  socket={socket}
                />
              </div>
            )
          })
        )}
      </aside>
      <div className="message-area-cont">
        <span className="toggle-friends" onClick={() => setShowFriends(true)}>
          <RiArrowLeftSLine />
        </span>
        <MessageArea
          body={
            state.friends.filter(
              (friend) => friend.username === state.chatWith,
            )[0] || {}
          }
          dispatch={dispatch}
          socket={state.socket}
        />
      </div>
    </div>
  )
}

export default Chat
