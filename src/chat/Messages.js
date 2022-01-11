import React from 'react'
import { RiTimeLine } from 'react-icons/ri'
import { useGlobalContext } from '../context'

function Messages(body) {
  const { messages } = body
  const sender = { ...body }
  const { user } = useGlobalContext()
  return (
    <div>
      {messages.map((message) => {
        return (
          <div key={message._id} className="single-msg">
            {message.sender === body.username ? (
              <img className="message-img" src={sender.img} alt="" />
            ) : null}
            <div>
              <div
                className={
                  message.sender === user.username ? 'sent-msg' : 'recieved-msg'
                }
              >
                <p className="message-text">{message.msg}</p>
                <p className="sent-time">
                  <RiTimeLine style={{ transform: 'translateY(2px)' }} />{' '}
                  {message.time}
                </p>
              </div>
              {message.sender === user.username ? (
                <h4 className="reciever-name">{user.username}</h4>
              ) : (
                <h4 className="sender-name">{body.username}</h4>
              )}
            </div>
            {message.sender === user.username ? (
              <img className="message-img reciever-img" src={user.img} alt="" />
            ) : null}
          </div>
        )
      })}
      <div className="single-msg">
        <img className="message-img" src={sender.img} alt="" />{' '}
        <div>
          <div className="recieved-msg">
            <p className="message-text">
              typing{' '}
              <span className="typing">
                <span className="dot-1">.</span>
                <span className="dot-2">.</span>
                <span className="dot-3">.</span>
              </span>
            </p>
          </div>
          <h4 className="sender-name">{sender.name}</h4>
        </div>
      </div>
    </div>
  )
}

export default Messages
