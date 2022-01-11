import React, { useState, useEffect } from 'react'
import LogIn from './LogIn'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'

import { useGlobalContext } from './context'
import Chat from './chat/Chat'

function App() {
  //importing if user is already signed in and displaying page acordingly
  const { user } = useGlobalContext()
  return (
    <>
      <Router>
        <Routes>
          {/* controlling what user can acces depending on sing in state */}
          <Route
            exact
            path="/sign-in"
            element={user.username ? <Navigate to="/" /> : <LogIn />}
          />
          <Route
            exact
            path="/"
            element={user.username ? <Chat /> : <Navigate to="/sign-in" />}
          />
        </Routes>
        {/* <h1>{data ? data : 'LOADING...'}</h1> */}
      </Router>
    </>
  )
}

export default App
