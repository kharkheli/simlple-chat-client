import React, { useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { useGlobalContext } from './context'

function LogIn() {
  const [redirect, setRedirect] = useState(false)
  const [username, setUsername] = useState('')
  const { setUser, setSMessage } = useGlobalContext()
  const submitHandle = async (e) => {
    e.preventDefault()
    await axios
      .post('http://localhost:3001/user/log-in', { username })
      .then((res) => {
        const userData = {
          username: res.data.username,
          friends: res.data.friends,
        }
        // setting user in localstorage so user remains ever after refreshing
        localStorage.setItem('user', userData.username)
        // using useContext to imediatly apply changes acroos the project
        setUser({ ...userData })
        setSMessage(res.data.msg + res.data.username)
        //redirecting user out of sign in
        setRedirect(true)
      })
  }
  return (
    <>
      {redirect ? (
        <Navigate to="/" />
      ) : (
        <div className="log-in">
          <div>
            <h2>Sing In</h2>
            {/* sing in happens only with username it is not best 
            practise but it's enough for the little project */}
            <form onSubmit={submitHandle}>
              <h3>Username</h3>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  if (!e.target.value.includes(' ')) {
                    setUsername(e.target.value)
                  }
                }}
              />
              <button type="submit">Sign In</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default LogIn
