import React, { useState, useEffect } from 'react'
import { useGlobalContext } from './context'
import { AiFillCheckCircle } from 'react-icons/ai'

//displaying greeting message firt time user sign ins
function Greeting({ message }) {
  const { sMessage } = useGlobalContext()
  const [modal, setModal] = useState(false)

  useEffect(() => {
    // we dont save greeting in localstorage so it is only presented
    // only firt time user sign in so we check for it
    if (sMessage || message) {
      setModal(true)
      setTimeout(() => {
        setModal(false)
      }, 4000)
    }
  }, [])
  return (
    <>
      {modal ? (
        <div className="modal-cont">
          <span className="close-modal" onClick={() => setModal(false)}>
            x
          </span>
          <i>
            <AiFillCheckCircle />
          </i>{' '}
          {message || sMessage}
        </div>
      ) : null}
    </>
  )
}

export default Greeting
