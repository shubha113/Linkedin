import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/slices/postSlice";
import "./CreatePostCard.css";

const CreatePostCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { createLoading } = useSelector((state) => state.posts);

  const [postText, setPostText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;

    const postData = {
      content: postText.trim(),
    };

    try {
      await dispatch(createPost(postData)).unwrap();
      setPostText("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // If user is not logged in, show a different message or component
  if (!user) {
    return (
      <div className="create-post-card">
        <div className="create-post-header">
          <img
            src="/default-avatar.png"
            alt="Default User"
            className="user-avatar"
          />
          <button className="post-input-trigger" disabled>
            Please log in to create a post.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        {/* CORRECTED: Removed the extra '.url' */}
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt={user?.name}
          className="user-avatar"
        />
        <button
          className="post-input-trigger"
          onClick={() => setShowForm(true)}
        >
          What's on your mind, {user?.name?.split(" ")[0]}?
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="post-textarea-container">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
              className="post-textarea"
              rows="3"
              autoFocus
            />
          </div>

          <div className="post-options">
            <div className="post-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setPostText("");
                }}
                disabled={createLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="post-btn"
                disabled={!postText.trim() || createLoading}
              >
                {createLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePostCard;
