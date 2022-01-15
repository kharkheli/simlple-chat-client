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

const socket = io('https://simple-chat-03.herokuapp.com', {
  autoConnect: false,
})

const defaultState = {
  // friends: [], // this is a huge mistake it should be an object
  // i am on the way to fix it

  friend: '', //this is search bar value
  // friendsv1 is updated list of friends
  friendsv1: {},
  socket,
  otherUsers: [],
  loadingUsers: false,
  chatWith: undefined,
  searchedFriends: {},
}

function Chat() {
  const [showFriends, setShowFriends] = useState(false)
  const [load, setLoad] = useState(1)
  const [loadingFriends, setLoadingFriends] = useState(false)
  const sound = useRef(null)
  const { user, setUser } = useGlobalContext()
  const [state, dispatch] = useReducer(reducer, defaultState)

  useEffect(async () => {
    setLoadingFriends(true)
    axios
      .get('https://simple-chat-03.herokuapp.com/user/friends', {
        params: {
          requester: user.username,
          usernames: user.friends.slice((load - 1) * 10, load * 10),
        },
      })
      .then((res) => {
        dispatch({
          type: 'LOAD_FRIENDS',
          payload: { friends: res.data.friends, recent: user.friends[0] },
        })
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
      // // console.log(data)
      dispatch({ type: 'USER_CONNECTED', payload: data.user })
    })
    socket.on('user disconnected', (data) => {
      // // console.log(data)
      dispatch({ type: 'USER_DISCONNECTED', payload: data.user })
    })
    socket.on('message sent', async (data) => {
      axios
        .get(
          `https://simple-chat-03.herokuapp.com/user/${data.message.sender}?requester=${user.username}`,
        )
        .then((res) => {
          dispatch({
            type: 'UPDATE_FRIENDS',
            payload: { ...res.data.user, messages: res.data.messages },
          })
        })
      // }

      // dispatch({ type: 'RECIEVE_MESSAGE', payload: data })
      setUser((user) => {
        return {
          ...user,
          friends: [...new Set([data.message.sender, ...user.friends])],
        }
      })

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
      dispatch({ type: 'BECOME_FRIEND', payload: data.user })
      setUser((user) => {
        return {
          ...user,
          friends: [...new Set([data.user.username, ...user.friends])],
        }
      })
    })
  }, [])

  useEffect(async () => {
    setLoadingFriends(true)
    axios
      .get('https://simple-chat-03.herokuapp.com/user/friends', {
        params: {
          requester: user.username,
          usernames: user.friends
            .filter((friend) => friend.startsWith(state.friend))
            .slice(0, 10),
        },
      })
      .then((res) => {
        dispatch({
          type: 'SEARCHED_FRIENDS',
          payload: { friends: res.data.friends },
        })
        setLoadingFriends(false)
      })

    dispatch({ type: 'LOADING_USERS' })
    axios
      .get(
        //addinmg limit and skip so it will return maximum of 10 users
        `https://simple-chat-03.herokuapp.com/user?starter=${state.friend}&username=${user.username}&limit=10skip=0`,
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
              dispatch({ type: 'SEARCH_FRIEND', payload: e.target.value })
            }
          />
        </div>
        <h1>Friends</h1>
        {state.friend
          ? user.friends.map((friend) => {
              if (!(friend in state.searchedFriends)) {
                return null
              }
              return (
                <div
                  className={state.chatWith === friend ? 'active-friend' : null}
                  key={friend}
                  onClick={() => {
                    dispatch({ type: 'CHAT_WITH', payload: friend })
                    setShowFriends(false)
                    dispatch({ type: 'SEARCH_FRIEND', payload: '' })
                    dispatch({
                      type: 'SEEN',
                      payload: { from: friend, to: user.username },
                    })
                  }}
                >
                  <Friend {...state.friendsv1[friend]} />
                </div>
              )
            })
          : user.friends.map((friend) => {
              if (!(friend in state.friendsv1)) {
                return null
              }
              return (
                <div
                  className={state.chatWith === friend ? 'active-friend' : null}
                  key={friend}
                  onClick={() => {
                    dispatch({ type: 'CHAT_WITH', payload: friend })
                    setShowFriends(false)
                    dispatch({
                      type: 'SEEN',
                      payload: { from: friend, to: user.username },
                    })
                  }}
                >
                  <Friend {...state.friendsv1[friend]} />
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
          body={state.friendsv1[state.chatWith] || {}}
          dispatch={dispatch}
          socket={state.socket}
        />
      </div>
    </div>
  )
}

export default Chat
