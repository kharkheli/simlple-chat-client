import React, { useReducer, useState, useEffect } from 'react'
import {
  RiMoreFill,
  RiUserLine,
  RiSearchLine,
  RiAttachmentLine,
  RiImageFill,
  RiSendPlane2Fill,
} from 'react-icons/ri'
import Messages from './Messages'
import { reducer } from './reducer'
import { io } from 'socket.io-client'
import { useGlobalContext } from '../context'

function MessageArea({ body, dispatch, socket }) {
  const { user } = useGlobalContext()
  const [message, setMessage] = useState('')
  // useEffect(() => {
  //   dispatch({ type: 'RESET', payload: defaultState })
  // }, [body])
  // useEffect(async () => {
  //   socket.auth = { username: user.username }
  //   socket.connect()
  //   socket.onAny((event, ...args) => {
  //     console.log(event, args)
  //   })
  //   socket.on('message sent', (data) => {
  //     dispatch({ type: 'MESSAGE_RECIEVED', payload: data })
  //   })
  // }, [])
  const typing = () => {
    socket.emit('typing', {
      from: user.username,
      to: body.username,
    })
  }
  const stopTyping = () => {
    socket.emit('stop typing', {
      from: user.username,
      to: body.username,
    })
  }
  return (
    <div className="chat-area">
      <header>
        <div className="body-info">
          <img className="body-img" src={body.img} alt={body.username} />
          <h2 className="body-name">{body.username}</h2>
        </div>
        <div className="tools-cont">
          <i>
            <RiSearchLine />
          </i>
          <i>
            <RiUserLine />
          </i>
          <i>
            <RiMoreFill />
          </i>
        </div>
      </header>
      {body.username ? <Messages {...body} /> : null}
      <form
        className="send-area"
        onSubmit={(e) => {
          e.preventDefault()
          if (message) {
            // socket.emit fires twice when in reducer
            //but even so i call reducer to update data for local user
            stopTyping()
            dispatch({
              type: 'SEND_MESSAGE',
              payload: { message, to: body.username, from: user.username },
            })

            socket.emit('message sent', {
              content: message,
              to: body.username,
              from: user.username,
            })
            setMessage('')
          }
        }}
      >
        <div className="input-cont">
          <input
            type="text"
            placeholder="Enter Message..."
            value={message}
            onFocus={() => {
              typing()
              dispatch({
                type: 'SEEN',
                payload: { from: body.username, to: user.username },
              })
            }}
            onBlur={stopTyping}
            onChange={(e) => {
              // to not emit socket every time message changes just when it
              // first changes after the message was sent
              !message && typing()
              setMessage(e.target.value)
            }}
          />
        </div>
        <div className="message-icons">
          <i>
            <RiAttachmentLine />
          </i>
          <i>
            <RiImageFill />
          </i>
          <button type="submit" style={{ border: 'none', borderRadius: '5px' }}>
            <i
              style={{
                backgroundColor: '#7269ef',
                color: 'white',
                cursor: 'pointer',
                padding: '0',
                margin: '0',
              }}
            >
              <RiSendPlane2Fill />
            </i>
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageArea
