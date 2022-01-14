import React, { useState, useEffect } from 'react'
import { GoPrimitiveDot } from 'react-icons/go'

function Friend(friend) {
  const [message, setMessage] = useState({
    msg: 'no message yet',
    time: 'future',
  })
  const [unseen, setUnseen] = useState(0)
  useEffect(() => {
    if (friend.messages.length) {
      const msg = friend.messages[friend.messages.length - 1]
      const time = new Date(msg.createdAt)
      const notSeen = friend.messages.filter(
        (msg) => !msg.seen && msg.sender === friend.username,
      ).length
      setUnseen(notSeen)
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
        {friend.active ? (
          <span className="active-user">
            <GoPrimitiveDot />
          </span>
        ) : (
          <span className="active-user" style={{ color: 'orange' }}>
            <GoPrimitiveDot />
          </span>
        )}
        <img className="friend-img" src={friend.img} alt={friend.username} />
      </div>

      <div className="friend-info">
        <h4 className="friend-name">{friend.username}</h4>
        <p className="friend-msg">
          {friend.typing ? (
            <span style={{ color: '#7269ef' }}>
              typing
              <span className="typing" style={{ color: 'inherit' }}>
                <span className="dot-1">.</span>
                <span className="dot-2">.</span>
                <span className="dot-3">.</span>
              </span>
            </span>
          ) : (
            message.msg.slice(0, 20)
          )}
        </p>
        <span className="not-seen">{unseen ? unseen : null}</span>
        <span className="last-time">{message.time}</span>
      </div>
    </div>
  )
}

export default Friend
