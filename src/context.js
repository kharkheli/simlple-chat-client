import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'

const UserContext = React.createContext()

const UserProvider = ({ children }) => {
  // we have useContext for user to be accessable around the project
  // it's just makes things simple no need to save

  const [user, setUser] = useState({})
  const [sMessage, setSMessage] = useState('')
  useEffect(async () => {
    const username = localStorage.getItem('user')
    if (username) {
      axios(`http://localhost:3001/user/${username}`).then((res) => {
        setUser(res.data)
      })
    }
  }, [])
  return (
    <UserContext.Provider value={{ user, setUser, sMessage, setSMessage }}>
      {children}
    </UserContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(UserContext)
}

export { UserContext, UserProvider }
