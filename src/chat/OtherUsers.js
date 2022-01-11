import React, { useState } from 'react'
import { RiUserAddLine } from 'react-icons/ri'
import Greeting from '../Greeting'
import axios from 'axios'

function OtherUsers({ dispatch, user }) {
  const [modal, setModal] = useState(false)
  const addFriend = async () => {
    // no need to set this state to false because after click
    //this component will dissapear from the dom tree
    setModal(true)
    dispatch({ type: 'ADD_FRIEND', payload: user.username })
    axios.patch('http://localhost:3001/user', {
      user: user.theGuy,
      friend: user.username,
    })
  }
  return (
    <div className="friend" style={{ cursor: 'default' }}>
      {modal ? (
        <Greeting message={`${user.username} has been added to friends`} />
      ) : null}
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
