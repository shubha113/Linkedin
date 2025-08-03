import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, addComment } from '../../redux/slices/postSlice.js'
import { formatDistanceToNow } from '../../utils/dateUtils';
import './PostCard.css'

const PostCard = ({ post }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [liking, setLiking] = useState(false)

  // NEW: Calculate counts and if the user has liked the post
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  // Check if the current user's ID is in the likes array
  const isLikedByCurrentUser = post.likes?.includes(user?._id) || false;

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      await dispatch(likePost(post._id)).unwrap();
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || commentLoading) return

    setCommentLoading(true)
    try {
      await dispatch(addComment({ 
        id: post._id, 
        comment: newComment.trim() 
      })).unwrap();
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false)
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <Link 
          to={`/profile/${post.author._id}`} 
          className="author-link"
        >
          <img 
            src={post.author.avatar || '/vite.svg'} 
            alt={post.author.name}
            className="author-avatar"
          />
        </Link>
        <div className="author-info">
          <Link 
            to={`/profile/${post.author._id}`} 
            className="author-name"
          >
            {post.author.name}
          </Link>
          <p className="author-bio">{post.author.bio}</p>
          <span className="post-time">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </span>
        </div>
        <div className="post-menu">
          <button className="menu-button">⋯</button>
        </div>
      </div>

      <div className="post-stats">
        <div className="stats-left">
          {likesCount > 0 && (
            <div className="stat-item likes-stat">
              <span className="like-icon">👍</span>
              <span className="stat-count">{likesCount}</span>
            </div>
          )}
        </div>
        <div className="stats-right">
          {commentsCount > 0 && (
            <button 
              className="stat-button"
              onClick={toggleComments}
            >
              <span className="stat-count">{commentsCount}</span>
              <span className="stat-label">comment{commentsCount !== 1 ? 's' : ''}</span>
            </button>
          )}
        </div>
      </div>

      <div className="post-actions">
        <button 
          className={`action-button ${isLikedByCurrentUser ? 'liked' : ''} ${liking ? 'loading' : ''}`}
          onClick={handleLike}
          disabled={liking}
        >
          <i className="action-icon">
            {liking ? '⏳' : (isLikedByCurrentUser ? '👍' : '👍')}
          </i>
          <span>Like</span>
        </button>
        
        <button 
          className="action-button"
          onClick={toggleComments}
        >
          <i className="action-icon">💬</i>
          <span>Comment</span>
        </button>
        
        <button className="action-button" disabled>
          <i className="action-icon">🔄</i>
          <span>Repost</span>
        </button>

        <button className="action-button" disabled>
          <i className="action-icon">📨</i>
          <span>Send</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="comment-form">
            <img 
              src={user?.avatar || '/vite.svg'} 
              alt={user?.name}
              className="comment-avatar"
            />
            <div className="comment-input-container">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
                disabled={commentLoading}
                maxLength={500}
              />
              <button 
                type="submit" 
                className="comment-submit"
                disabled={!newComment.trim() || commentLoading}
              >
                {commentLoading ? '⏳' : 'Post'}
              </button>
            </div>
          </form>

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <Link to={`/profile/${comment.user._id}`}>
                    <img 
                      src={comment.user.avatar || '/vite.svg'} 
                      alt={comment.user.name}
                      className="comment-user-avatar"
                    />
                  </Link>
                  <div className="comment-content">
                    <div className="comment-bubble">
                      <Link 
                        to={`/profile/${comment.user._id}`}
                        className="comment-user-name"
                      >
                        {comment.user.name}
                      </Link>
                      <p className="comment-text">{comment.comment}</p>
                    </div>
                    <div className="comment-meta">
                      <span className="comment-time">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                      <button className="comment-like-btn" disabled>
                        Like
                      </button>
                      <button className="comment-reply-btn" disabled>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard;