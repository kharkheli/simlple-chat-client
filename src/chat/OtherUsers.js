import React, { useState } from 'react'
import { RiUserAddLine } from 'react-icons/ri'
import axios from 'axios'
import { useGlobalContext } from '../context'

function OtherUsers({ socket, dispatch, user }) {
  const { user: theGuy, setUser } = useGlobalContext()
  const addFriend = async () => {
    // no need to set this state to false because after click
    //this component will dissapear from the dom tree
    // setModal(true)

    dispatch({ type: 'ADD_FRIEND', payload: user.username })
    dispatch({ type: 'SEARCH_FRIEND', payload: '' })
    setUser({ ...theGuy, friends: [...theGuy.friends, user.username] })
    // // console.log(theGuy)
    socket.emit('add friend', {
      from: theGuy.username,
      to: user.username,
      theGuy,
    })
    axios.patch('https://simple-chat-03.herokuapp.com/user', {
      user: theGuy.username,
      friend: user.username,
    })
  }
  return (
    <div className="friend" style={{ cursor: 'default' }}>
      <div className="friend-img-cont">
        <img className="friend-img" src={user.img} alt={user.username} />
      </div>

      <div className="friend-info">
        <h4 className="friend-name">{user.username}</h4>
        <p className="friend-msg">unknown mutual friends</p>
        <span className="last-time">
          <RiUserAddLine
            onClick={addFriend}
            style={{ fontSize: '1.2rem', cursor: 'pointer' }}
          />
        </span>
      </div>
    </div>
  )
}

export default OtherUsers
