import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../redux/slices/userSlice.js'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector(state => state.user)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    return () => {
      dispatch(clearError())
    }
  }, [isAuthenticated, navigate, dispatch])

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <h1 className="auth-title">Professional Network</h1>
          <p className="auth-subtitle">
            Connect with professionals and grow your career
          </p>
          <div className="auth-features">
            <div className="feature-item">
              <i className="feature-icon">🌐</i>
              <span>Build your professional network</span>
            </div>
            <div className="feature-item">
              <i className="feature-icon">💼</i>
              <span>Share your professional updates</span>
            </div>
            <div className="feature-item">
              <i className="feature-icon">🚀</i>
              <span>Advance your career</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2 className="card-title">Sign in to your account</h2>
            <p className="card-subtitle">Welcome back! Please enter your details</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="auth-button primary"
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login