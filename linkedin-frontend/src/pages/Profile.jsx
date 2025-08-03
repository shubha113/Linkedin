import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, clearProfileData } from "../redux/slices/userSlice";
import PostCard from "../components/post/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profileData, loading: profileLoading } = useSelector(
    (state) => state.user
  );
  const { userPosts: posts, loading: postsLoading } = useSelector(
    (state) => state.user
  );
  const { user: currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (id) {
      dispatch(clearProfileData());
      dispatch(getUserProfile(id));
    }
  }, [dispatch, id]);

  if (profileLoading && !profileData) {
    return (
      <div className="profile-loading">
        <LoadingSpinner size="large" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-error">
        <div className="error-content">
          <h2>Profile not found</h2>
          <p>The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profileData._id;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="cover-gradient"></div>
        </div>

        <div className="profile-info-section">
          {/* ... (rest of your profile header HTML) ... */}
          <div className="profile-main-info">
            <div className="profile-details">
              <img
                src={profileData?.avatar || "/default-avatar.png"}
                alt={`${profileData?.name}'s avatar`}
                className="profile-avatar"
              />
              <h1 className="profile-name">{profileData.name}</h1>
              <p className="profile-bio">{profileData.bio || "Professional"}</p>
              <p className="profile-email">{profileData.email}</p>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">
                    {posts && posts.length > 0 ? posts.length : 0}
                  </span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-main">
          {/* About Section */}
          <div className="about-section">
            <div className="section-header">
              <h3>About</h3>
            </div>
            <div className="about-content">
              <p>{profileData.bio || "No bio available."}</p>

              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>{profileData.email}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📅</span>
                  <span>
                    Joined{" "}
                    {new Date(profileData.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="activity-section">
            <div className="activity-content">
              {activeTab === "posts" && (
                <div className="posts-tab">
                  {postsLoading ? (
                    <div className="posts-loading">
                      <LoadingSpinner />
                      <p>Loading posts...</p>
                    </div>
                  ) : posts?.length > 0 ? (
                    <div className="posts-list">
                      {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="no-posts">
                      <div className="no-posts-icon">📝</div>
                      <h4>No posts yet</h4>
                      <p>
                        {isOwnProfile
                          ? "You haven't shared anything yet. Create your first post!"
                          : `${profileData.name} hasn't shared anything yet.`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div className="activity-tab">
                  <div className="no-activity">
                    <div className="no-activity-icon">📊</div>
                    <h4>No recent activity</h4>
                    <p>Comments and likes will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
