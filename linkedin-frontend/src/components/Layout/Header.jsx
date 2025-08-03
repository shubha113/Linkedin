import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/slices/userSlice.js'
import './Header.css';

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = () => {
    dispatch(logoutUser())
    setShowProfileMenu(false)
    navigate('/login')
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`)
    setShowProfileMenu(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-text">Professional Network</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">
            <i className="nav-icon">🏠</i>
            <span>Home</span>
          </Link>
        </nav>

        <div className="header-right">
          <div className="profile-section" ref={menuRef}>
            <button 
              className="profile-button"
              onClick={handleProfileClick}
            >
              <img 
                src={user?.avatar || '../../vite.svg'} 
                alt={user?.name || 'User'}
                className="profile-avatar"
              />
              <span className="profile-name-header">{user?.name}</span>
              <i className={`dropdown-arrow ${showProfileMenu ? 'open' : ''}`}>▼</i>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <img 
                    src={user?.avatar || '../../vite.svg'} 
                    alt={user?.name}
                    className="dropdown-avatar"
                  />
                  <div className="dropdown-info">
                    <h4>{user?.name}</h4>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={handleViewProfile}
                >
                  <i className="dropdown-icon">👤</i>
                  View Profile
                </button>
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <i className="dropdown-icon">🚪</i>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header