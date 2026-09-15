import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors";
import styles from "./ProfilePage.module.scss";
import profile from "../../assets/profile.webp";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const auth = useSelector(selectUser);

  const loggedUser =
    auth.user ||
    (() => {
      try {
        const savedUser = localStorage.getItem("nexoraUser");

        return savedUser
          ? JSON.parse(savedUser)
          : null;
      } catch {
        return null;
      }
    })();

  const profileStorageKey = loggedUser?.id
    ? `nexoraProfile_${loggedUser.id}`
    : `nexoraProfile_${loggedUser?.email || "guest"}`;

  // SETTINGS
  const settings = useMemo(() => {
    try {
      const savedSettings =
        localStorage.getItem("nexoraSettings");

      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.log(
        "Could not load Nexora settings:",
        error
      );
    }

    return {
      privateAccount: false,
      showEmail: true,
    };
  }, []);

  // Profile 1 = profilul nostru
  const isOwnProfile = id === "1";

  // Profilul este ascuns doar pentru ceilalti utilizatori
  const profileIsPrivate =
    settings.privateAccount && !isOwnProfile;

  const [isEditing, setIsEditing] = useState(false);

  // PROFILE DATA
  const [profileData, setProfileData] = useState(() => {
    try {
      const savedProfile =
        localStorage.getItem(profileStorageKey);

      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch (error) {
      console.log(
        "Could not load Nexora profile:",
        error
      );
    }

    const userName =
      loggedUser?.name ||
      loggedUser?.email?.split("@")[0] ||
      "Nexora User";

    return {
      name: userName,
      username: `@${userName
        .toLowerCase()
        .replace(/\s+/g, ".")}`,
      bio: "Welcome to my Nexora profile 👋 Connecting with friends and sharing moments.",
      location: "Romania",
      email: loggedUser?.email || "",
      joined: "2026",
    };
  });

  const [editData, setEditData] =
    useState(profileData);

  // POSTS
  const [myPosts, setMyPosts] = useState(() => {
    try {
      const savedPosts =
        localStorage.getItem("nexoraPosts");

      if (!savedPosts) {
        return [];
      }

      const parsedPosts = JSON.parse(savedPosts);

      return parsedPosts.filter((post) => {
        // Postarile noi - verificare prin ID
        if (loggedUser?.id && post.userId) {
          return (
            String(post.userId) ===
            String(loggedUser.id)
          );
        }

        // Verificare prin email
        if (loggedUser?.email && post.email) {
          return post.email === loggedUser.email;
        }

        // Postarile vechi - verificare prin nume
        return post.author === profileData.name;
      });
    } catch (error) {
      console.log(
        "Could not load profile posts:",
        error
      );

      return [];
    }
  });

  // DELETE POST FROM PROFILE
  const handleDeletePost = (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const savedPosts =
        localStorage.getItem("nexoraPosts");

      if (!savedPosts) {
        return;
      }

      const allPosts = JSON.parse(savedPosts);

      const updatedPosts = allPosts.filter(
        (post) => post.id !== postId
      );

      localStorage.setItem(
        "nexoraPosts",
        JSON.stringify(updatedPosts)
      );

      setMyPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== postId
        )
      );
    } catch (error) {
      console.log(
        "Could not delete post:",
        error
      );
    }
  };

  // EDIT PROFILE
  const handleEditProfile = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setProfileData(editData);

    localStorage.setItem(
      profileStorageKey,
      JSON.stringify(editData)
    );

    setIsEditing(false);
  };

  // CREATE POST
  const handleCreatePost = () => {
    navigate("/");

    setTimeout(() => {
      const createPost =
        document.getElementById("create-post");

      const input =
        document.getElementById(
          "create-post-input"
        );

      createPost?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      input?.focus();
    }, 150);
  };

  return (
    <div className={styles.profilePage}>
      {/* COVER */}
      <div className={styles.cover}>
        <div
          className={styles.coverOverlay}
        ></div>
      </div>

      {/* PROFILE HEADER */}
      <div className={styles.profileCard}>
        <div className={styles.profileTop}>
          <img
            src={profile}
            alt={profileData.name}
            className={styles.avatar}
          />

          {/* Edit apare doar pe profilul nostru */}
          {isOwnProfile && (
            <button
              type="button"
              className={styles.editButton}
              onClick={handleEditProfile}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        <div className={styles.profileInfo}>
          <h1>{profileData.name}</h1>
          <p>{profileData.username}</p>
        </div>

        <p className={styles.bio}>
          {profileData.bio}
        </p>

        {/* Stats */}
        {!profileIsPrivate && (
          <div className={styles.stats}>
            <div>
              <strong>128</strong>
              <span>Friends</span>
            </div>

            <div>
              <strong>{myPosts.length}</strong>
              <span>Posts</span>
            </div>

            <div>
              <strong>86</strong>
              <span>Following</span>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PROFILE */}
      {isEditing && isOwnProfile && (
        <div className={styles.editCard}>
          <div className={styles.editHeader}>
            <div>
              <h2>Edit Profile</h2>

              <p>
                Update how your profile appears on
                Nexora.
              </p>
            </div>

            <button
              type="button"
              className={styles.closeEdit}
              onClick={handleCancelEdit}
            >
              ✕
            </button>
          </div>

          <div className={styles.editGrid}>
            {/* NAME */}
            <div className={styles.editControl}>
              <label htmlFor="profile-name">
                Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={editData.name}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    name: event.target.value,
                  })
                }
              />
            </div>

            {/* USERNAME */}
            <div className={styles.editControl}>
              <label htmlFor="profile-username">
                Username
              </label>

              <input
                id="profile-username"
                type="text"
                value={editData.username}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    username: event.target.value,
                  })
                }
              />
            </div>

            {/* LOCATION */}
            <div className={styles.editControl}>
              <label htmlFor="profile-location">
                Location
              </label>

              <input
                id="profile-location"
                type="text"
                value={editData.location}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    location: event.target.value,
                  })
                }
              />
            </div>

            {/* EMAIL */}
            <div className={styles.editControl}>
              <label htmlFor="profile-email">
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={editData.email}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    email: event.target.value,
                  })
                }
              />
            </div>

            {/* BIO */}
            <div
              className={`${styles.editControl} ${styles.fullWidth}`}
            >
              <label htmlFor="profile-bio">
                Bio
              </label>

              <textarea
                id="profile-bio"
                rows="4"
                value={editData.bio}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    bio: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.editActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>

            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* PRIVATE PROFILE */}
      {profileIsPrivate ? (
        <div className={styles.content}>
          <section className={styles.postsCard}>
            <div className={styles.emptyPosts}>
              <div
                className={styles.emptyIcon}
              >
                🔒
              </div>

              <h3>
                This account is private
              </h3>

              <p>
                Add this person as a friend to
                see their posts and profile
                details.
              </p>
            </div>
          </section>
        </div>
      ) : (
        /* NORMAL PROFILE */
        <div className={styles.content}>
          {/* POSTS */}
          <section className={styles.postsCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>My Posts</h2>

                <p>
                  Everything you've shared on
                  Nexora.
                </p>
              </div>

              {isOwnProfile && (
                <button
                  type="button"
                  className={
                    styles.createSmallButton
                  }
                  onClick={handleCreatePost}
                >
                  + Create Post
                </button>
              )}
            </div>

            {myPosts.length > 0 ? (
              <div className={styles.postsList}>
                {myPosts.map((post) => (
                  <article
                    className={
                      styles.profilePost
                    }
                    key={post.id}
                  >
                    <div
                      className={
                        styles.postHeader
                      }
                    >
                      <img
                        src={profile}
                        alt={profileData.name}
                      />

                      <div>
                        <h3>
                          {profileData.name}
                        </h3>

                        <span>
                          {post.createdAt}
                        </span>
                      </div>

                      {isOwnProfile && (
                        <button
                          type="button"
                          className={
                            styles.deletePostButton
                          }
                          onClick={() =>
                            handleDeletePost(
                              post.id
                            )
                          }
                          title="Delete post"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>

                    {post.text && (
                      <p
                        className={
                          styles.postText
                        }
                      >
                        {post.text}
                      </p>
                    )}

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Profile post"
                        className={
                          styles.postImage
                        }
                      />
                    )}

                    <div
                      className={
                        styles.postStats
                      }
                    >
                      <span>
                        ❤️ {post.likes} likes
                      </span>

                      <span>
                        💬{" "}
                        {post.comments?.length ||
                          0}{" "}
                        comments
                      </span>

                      <span>
                        🔁 {post.shares} shares
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyPosts}>
                <div
                  className={styles.emptyIcon}
                >
                  📝
                </div>

                <h3>No posts yet</h3>

                <p>
                  Your posts will appear here
                  when you share something with
                  your friends.
                </p>

                {isOwnProfile && (
                  <button
                    type="button"
                    className={
                      styles.createButton
                    }
                    onClick={handleCreatePost}
                  >
                    Create a post
                  </button>
                )}
              </div>
            )}
          </section>

          {/* ABOUT */}
          <aside className={styles.aboutCard}>
            <h2>About</h2>

            <div className={styles.aboutItem}>
              <span>📍</span>

              <div>
                <small>Location</small>

                <strong>
                  {profileData.location}
                </strong>
              </div>
            </div>

            {/* Email respecta Show Email */}
            {settings.showEmail && (
              <div
                className={styles.aboutItem}
              >
                <span>📧</span>

                <div>
                  <small>Email</small>

                  <strong>
                    {profileData.email}
                  </strong>
                </div>
              </div>
            )}

            <div className={styles.aboutItem}>
              <span>👥</span>

              <div>
                <small>Friends</small>
                <strong>128 friends</strong>
              </div>
            </div>

            <div className={styles.aboutItem}>
              <span>🗓️</span>

              <div>
                <small>Joined</small>

                <strong>
                  Nexora in{" "}
                  {profileData.joined}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;