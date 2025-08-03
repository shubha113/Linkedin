import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts, resetPosts } from '../redux/slices/postSlice'
import PostCard from '../components/post/PostCard.jsx'
import CreatePostCard from '../components/post/CreatePostCard'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch()
  const { posts, loading, hasMore } = useSelector(state => state.posts)
  const { user } = useSelector(state => state.user)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    dispatch(resetPosts())
    dispatch(getAllPosts({ limit: 10 }))
  }, [dispatch])

  const loadMorePosts = async () => {
    if (hasMore && !loading && !loadingMore && posts.length > 0) {
      setLoadingMore(true)
      const lastPost = posts[posts.length - 1]
      await dispatch(getAllPosts({ 
        limit: 10, 
        lastCreatedAt: lastPost.createdAt 
      }))
      setLoadingMore(false)
    }
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      loadMorePosts()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, loadingMore, posts])

  if (loading && posts.length === 0) {
    return (<div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>)
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="feed-section">
          <CreatePostCard />
          
          <div className="posts-container">
            {posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
                
                {loadingMore && (
                  <div className="load-more-spinner">
                    <LoadingSpinner size="small" />
                  </div>
                )}
                
                {!hasMore && posts.length > 0 && (
                  <div className="end-message">
                    <p>You've reached the end! 🎉</p>
                  </div>
                )}
              </>
            ) : (
              <div className="no-posts">
                <div className="no-posts-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Be the first to share something with the community!</p>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="profile-sidebar-home">
            <div className="profile-card">
              <div className="profile-cover-home"></div>
              <div className="profile-info">
                <img 
                  src={user?.avatar || '../../vite.svg'} 
                  alt={user?.name}
                  className="profile-image"
                />
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-bio">{user?.bio || 'Professional'}</p>
              </div>
            </div>
          </div>

          <div className="suggestions-card">
            <h4>Trending Topics</h4>
            <div className="trending-topics">
              <div className="topic-item">
                <span className="topic-tag">#WebDevelopment</span>
                <span className="topic-count">1.2k posts</span>
              </div>
              <div className="topic-item">
                <span className="topic-tag">#React</span>
                <span className="topic-count">856 posts</span>
              </div>
              <div className="topic-item">
                <span className="topic-tag">#JavaScript</span>
                <span className="topic-count">2.1k posts</span>
              </div>
              <div className="topic-item">
                <span className="topic-tag">#Career</span>
                <span className="topic-count">967 posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home