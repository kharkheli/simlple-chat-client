import React from 'react'
import { RiTimeLine } from 'react-icons/ri'
import { useGlobalContext } from '../context'

// const messages = [
//   { state: 'sender', msg: 'hallo sucker', time: '12:50' },
//   { state: 'reciever', msg: 'hallo sucker', time: '12:50' },
//   { state: 'reciever', msg: 'hallo sucker', time: '12:50' },
//   { state: 'sender', msg: 'hallo sucker', time: '12:50' },
//   { state: 'reciever', msg: 'hallo sucker', time: '12:50' },
//   { state: 'sender', msg: 'hallo sucker', time: '12:50' },
//   { state: 'reciever', msg: 'hallo sucker', time: '12:50' },
//   { state: 'sender', msg: 'hallo sucker', time: '12:50' },
//   { state: 'reciever', msg: 'hallo sucker', time: '12:50' },
//   { state: 'sender', msg: 'hallo sucker', time: '12:50' },
//   { state: 'reciever', msg: 'hallo sucker', time: '12:50' },
// ]

// const sender = {
//   img:
//     'https://cdn.pixabay.com/photo/2017/03/09/09/57/stack-2129070_960_720.jpg',
//   name: 'mustafa',
// }

// const reciever = {
//   img:
//     'https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548_960_720.jpg',
//   name: 'shmagi',
// }

function Messages({ state, dispatch, body }) {
  const { messages } = body
  const sender = { ...body }
  const { user } = useGlobalContext()
  return (
    <div>
      {messages.map((message) => {
        return (
          <div className="single-msg">
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
