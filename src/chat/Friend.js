import React, { useState, useEffect } from 'react'

function Friend(friend) {
  const [message, setMessage] = useState({
    msg: 'no message yet',
    time: 'future',
  })
  useEffect(() => {
    if (friend.messages.length) {
      const msg = friend.messages[friend.messages.length - 1]
      const time = new Date(msg.createdAt)
      setMessage({
        msg: msg.msg,
        time:
          time.getHours() +
          ':' +
          (time.getMinutes() / 10 >= 1
            ? time.getMinutes()
            : '0' + time.getMinutes()),
      })
    }
  }, [friend])
  return (
    <div className="friend">
      <div className="friend-img-cont">
        <img className="friend-img" src={friend.img} alt={friend.username} />
      </div>

      <div className="friend-info">
        <h4 className="friend-name">{friend.username}</h4>
        <p className="friend-msg">{message.msg}</p>
        <span className="last-time">{message.time}</span>
      </div>
    </div>
  )
}

export default Friend
