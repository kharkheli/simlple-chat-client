import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { RiTimeLine } from 'react-icons/ri'
import { useGlobalContext } from '../context'

function Messages({ body, dispatch }) {
  const [load, setLoad] = useState('loaded')
  const { messages } = body
  const msgRef = useRef(null)
  const sender = { ...body }
  const [scroll, setScroll] = useState(0)
  const [expandImage, setExpandImage] = useState('')
  const [skip, setSkip] = useState(1)
  useEffect(() => {
    msgRef.current.scrollTo(0, msgRef.current.scrollHeight - scroll)
  }, [messages])
  const { user } = useGlobalContext()
  return (
    <div
      className="messages-cont"
      ref={msgRef}
      onScroll={async (e) => {
        setScroll(msgRef.current.scrollHeight - msgRef.current.scrollTop)
        if (e.target.scrollTop === 0 && load === 'loaded') {
          setLoad('loading')
          await axios
            .get('http://localhost:3001/user/messages', {
              params: {
                user: user.username,
                friend: body.username,
                skip: skip * 10,
                limit: 10,
              },
            })
            .then((res) => {
              dispatch({
                type: 'MESSAGES_LOADED',
                payload: { messages: res.data.messages, friend: body.username },
              })
              setLoad(res.data.messages.length ? 'loaded' : 'finished')
              setSkip(skip + 1)
            })
        }
      }}
    >
      <h3 style={{ color: 'white', textAlign: 'center' }}>
        {load === 'loading' ? 'loading...' : null}
      </h3>
      {expandImage ? (
        <div
          className="expanded-image"
          onClick={(e) => {
            if (e.target.className === 'expanded-image') {
              setExpandImage('')
            }
          }}
        >
          <img src={expandImage} alt={expandImage} />
        </div>
      ) : null}
      {messages.map((message, index) => {
        const time = new Date(message.createdAt)
        return (
          <div key={message._id || message.time} className="single-msg">
            {/* check so only last message will have a name and img */}
            {(!(index + 1 in messages) ||
              message.sender !== messages[index + 1].sender) &&
            message.sender === body.username ? (
              <img className="message-img" src={sender.img} alt="" />
            ) : null}
            <div>
              <div
                className={
                  message.sender === user.username ? 'sent-msg' : 'recieved-msg'
                }
              >
                {message.type === 'image' ? (
                  <img
                    className="sent-image"
                    onClick={() => setExpandImage(message.msg)}
                    src={message.msg}
                    alt="image"
                  />
                ) : (
                  <>
                    {message.type === 'link' ? (
                      <>
                        {message.msg.includes('youtube.com/watch?v=') ||
                        message.msg.includes('youtu.be') ? (
                          <>
                            <iframe
                              className="youtube-video"
                              src={`https://www.youtube.com/embed/${
                                message.msg.includes('youtu.be')
                                  ? message.msg.split('/')[3]
                                  : message.msg.split('v=')[1].split('&')[0]
                              }`}
                              title="YouTube video player"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen
                            ></iframe>
                            <p
                              className="message-text"
                              style={{ width: '300px', maxWidth: '100%' }}
                            >
                              <a
                                href={message.msg}
                                target="_blank"
                                style={{ color: 'white' }}
                              >
                                {message.msg}
                              </a>
                            </p>
                          </>
                        ) : (
                          <p className="message-text">
                            <a
                              href={message.msg}
                              target="_blank"
                              style={{ color: '#645fcc' }}
                            >
                              {message.msg}
                            </a>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="message-text">{message.msg}</p>
                    )}
                  </>
                )}
                <p className="sent-time">
                  <RiTimeLine style={{ transform: 'translateY(2px)' }} />{' '}
                  {time.getHours() +
                    ':' +
                    (time.getMinutes() / 10 >= 1
                      ? time.getMinutes()
                      : '0' + time.getMinutes())}
                </p>
              </div>
              {!(index + 1 in messages) ||
              message.sender !== messages[index + 1].sender ? (
                <>
                  {message.sender === user.username ? (
                    <h4 className="reciever-name">{user.username}</h4>
                  ) : (
                    <h4 className="sender-name">{body.username}</h4>
                  )}
                </>
              ) : null}
            </div>

            {(!(index + 1 in messages) ||
              message.sender !== messages[index + 1].sender) &&
            message.sender === user.username ? (
              <img className="message-img reciever-img" src={user.img} alt="" />
            ) : null}
          </div>
        )
      })}
      {body.typing ? (
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
      ) : null}
    </div>
  )
}

export default Messages
