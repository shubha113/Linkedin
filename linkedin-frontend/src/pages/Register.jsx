import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../redux/slices/userSlice.js'
import './Auth.css'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.user)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0]
      if (file) {
        setAvatar(file)
        setAvatarPreview(URL.createObjectURL(file))
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  const submitData = new FormData()
  submitData.append('name', formData.name)
  submitData.append('email', formData.email)
  submitData.append('password', formData.password)
  submitData.append('bio', formData.bio)
  if (avatar) submitData.append('file', avatar)

  try {
    await dispatch(registerUser(submitData)).unwrap() 
    navigate('/login')
  } catch (err) {
    console.error('Registration failed:', err)
  }
}

  useEffect(() => {
    return () => {
      dispatch(clearError())
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [dispatch, avatarPreview])

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <h1 className="auth-title">Join Professional Network</h1>
          <p className="auth-subtitle">
            Create your professional profile and start connecting
          </p>
          <div className="auth-features">
            <div className="feature-item">
              <i className="feature-icon">👥</i>
              <span>Connect with like-minded professionals</span>
            </div>
            <div className="feature-item">
              <i className="feature-icon">📈</i>
              <span>Share your achievements and updates</span>
            </div>
            <div className="feature-item">
              <i className="feature-icon">💡</i>
              <span>Discover new opportunities</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2 className="card-title">Create your account</h2>
            <p className="card-subtitle">Start your professional journey today</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <div className="avatar-placeholder">
                      <i>👤</i>
                    </div>
                  )}
                </div>
                <label htmlFor="avatar" className="avatar-upload-btn">
                  <i>📷</i>
                  Upload Photo
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="avatar-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

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
                  placeholder="Create a strong password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                  rows="3"
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register