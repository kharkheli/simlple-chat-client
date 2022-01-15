import React, { useState, useEffect } from 'react'
import {
  RiMoreFill,
  RiUserLine,
  RiSearchLine,
  RiAttachmentLine,
  RiImageFill,
  RiSendPlane2Fill,
  RiLogoutCircleRLine,
} from 'react-icons/ri'
import Messages from './Messages'
import { useGlobalContext } from '../context'
import { GoPrimitiveDot } from 'react-icons/go'
import axios from 'axios'

function MessageArea({ body, dispatch, socket }) {
  const { user, setUser } = useGlobalContext()
  const [message, setMessage] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [moreOptions, setMoreOptions] = useState(false)

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (e.target.id === 'more-options') {
        setMoreOptions((old) => {
          return !old
        })
      } else {
        if (e.target.id === 'log-out') {
          localStorage.removeItem('user')
          window.location.reload()
        } else {
          setMoreOptions(false)
        }
      }
    })
  }, [])
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
  const sendImage = (e) => {
    const image = e.target.files[0]
    const form = new FormData()
    form.append('image', image)
    axios
      .post('http://localhost:3001/uploads/img', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setImagePath('http://localhost:3001/' + res.data.path)
      })
  }
  const sendMessage = (e) => {
    e.preventDefault()
    if (message) {
      // socket.emit fires twice when in reducer
      //but even so i call reducer to update data for local user
      stopTyping()
      let type = 'text'
      if (message.startsWith('http')) {
        type = 'link'
      }
      dispatch({
        type: 'SEND_MESSAGE',
        payload: {
          message,
          to: body.username,
          type,
          from: user.username,
        },
      })
      setUser((user) => {
        return {
          ...user,
          friends: [...new Set([body.username, ...user.friends])],
        }
      })

      socket.emit('message sent', {
        content: message,
        type,
        to: body.username,
        from: user.username,
      })
      setMessage('')
    }
  }
  return (
    <>
      {'username' in body ? (
        <div className="chat-area">
          {imagePath ? (
            <div className="image-prev">
              <div className="prev-img-cont">
                <img className="prev-img" src={imagePath} />
                <div className="image-cation-cont">
                  <span
                    className="image-action"
                    style={{ left: '20px' }}
                    onClick={() => {
                      setImagePath('')
                      axios.delete(
                        `http://localhost:3001/uploads/img?name=${
                          imagePath.split('/')[4]
                        }`,
                      )
                    }}
                  >
                    cancel
                  </span>
                  <span
                    className="image-action"
                    style={{ right: '20px' }}
                    onClick={() => {
                      dispatch({
                        type: 'SEND_MESSAGE',
                        payload: {
                          message: imagePath,
                          type: 'image',
                          to: body.username,
                          from: user.username,
                        },
                      })

                      socket.emit('message sent', {
                        content: imagePath,
                        type: 'image',
                        to: body.username,
                        from: user.username,
                      })
                      setImagePath('')
                    }}
                  >
                    send
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <header>
            <div className="body-info">
              <img className="body-img" src={body.img} alt={body.username} />
              <h2 className="body-name">
                {body.username}{' '}
                {body.active ? (
                  <span className="active-user" style={{ position: 'static' }}>
                    <GoPrimitiveDot />
                  </span>
                ) : (
                  <span
                    className="active-user"
                    style={{ position: 'static', color: 'orange' }}
                  >
                    <GoPrimitiveDot />
                  </span>
                )}
              </h2>
            </div>
            <div className="tools-cont">
              {moreOptions ? (
                <div className="more-options">
                  <div className="option" id="log-out">
                    Log out{' '}
                    <i>
                      <RiLogoutCircleRLine />
                    </i>
                  </div>
                </div>
              ) : null}
              <i>
                <RiMoreFill id="more-options" />
              </i>
            </div>
          </header>
          {body.username ? <Messages body={body} dispatch={dispatch} /> : null}
          <form className="send-area" onSubmit={sendMessage}>
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
                  if (!message) {
                    typing()
                    dispatch({
                      type: 'SEEN',
                      payload: { from: body.username, to: user.username },
                    })
                  }
                  setMessage(e.target.value)
                }}
              />
            </div>
            <div className="message-icons">
              <label htmlFor="image">
                <i>
                  <RiImageFill />
                </i>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={sendImage}
              />

              <button
                type="submit"
                style={{ border: 'none', borderRadius: '5px' }}
              >
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
      ) : (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ color: 'white' }}>
            Your friends are loading or you don't have nay friends yet
          </h1>
        </div>
      )}
    </>
  )
}

export default MessageArea
