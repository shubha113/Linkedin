import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './redux/slices/userSlice';
import Header from './components/Layout/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated, loading} = useSelector(state => state.user);

  useEffect(()=>{
    dispatch(loadUser())
  }, [dispatch])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
      <div className='app'>
        {isAuthenticated && <Header/>}
        <main className={isAuthenticated ? 'main-content' : 'auth-main'}>
           <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />

          </Routes>
        </main>
      </div>
  )
}

export default App
