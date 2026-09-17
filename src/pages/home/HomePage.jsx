import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Newsfeed from "../feed/newsfeed/Newsfeed";
import styles from "./HomePage.module.scss";
import feedService from "../../services/feedService";
import profile from "../../assets/profile.webp";
import { selectUser } from "../../redux/selectors";

const HomePage = () => {
  const auth = useSelector(selectUser);

  const loggedUser =
    auth.user ||
    (() => {
      try {
        const savedUser = localStorage.getItem("nexoraUser");

        return savedUser ? JSON.parse(savedUser) : null;
      } catch {
        return null;
      }
    })();

  const currentUserName =
    loggedUser?.name ||
    loggedUser?.email?.split("@")[0] ||
    "Nexora User";

  const [postList, setPostList] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);

  // POSTS LOCALE
  const [demoPosts, setDemoPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem("nexoraPosts");

      if (savedPosts) {
        return JSON.parse(savedPosts);
      }
    } catch (error) {
      console.log("Could not load saved posts:", error);
    }

    return [
      {
        id: 1,
        author: "Fabian Toma",
        text: "Welcome to Nexora 👋 This is my first post!",
        image: null,
        likes: 24,
        shares: 0,
        liked: false,
        createdAt: "Just now",
        comments: [],
        showComments: false,
        commentText: "",
      },
      {
        id: 2,
        author: "Alex",
        text: "Enjoying a beautiful day ☀️",
        image: null,
        likes: 18,
        shares: 2,
        liked: false,
        createdAt: "2 hours ago",
        comments: [],
        showComments: false,
        commentText: "",
      },
    ];
  });

  // SUGGESTED FRIENDS
  const [friends, setFriends] = useState(() => {
    try {
      const savedFriends = localStorage.getItem("nexoraFriends");

      if (savedFriends) {
        return JSON.parse(savedFriends);
      }
    } catch (error) {
      console.log("Could not load saved friends:", error);
    }

    return [
      {
        id: 1,
        name: "Alex",
        added: false,
      },
      {
        id: 2,
        name: "Maria",
        added: false,
      },
      {
        id: 3,
        name: "David",
        added: false,
      },
    ];
  });

  // INCARCA POSTARILE DIN API
  useEffect(() => {
    async function getPosts() {
      const response = await feedService.get();
      setPostList(response);
    }

    getPosts().catch((error) => {
      console.log("API posts error:", error);
    });
  }, []);

  // SALVEAZA POSTARILE LOCALE
  useEffect(() => {
    try {
      localStorage.setItem(
        "nexoraPosts",
        JSON.stringify(demoPosts)
      );
    } catch (error) {
      console.log("Could not save posts:", error);
    }
  }, [demoPosts]);

  // SALVEAZA PRIETENII
  useEffect(() => {
    try {
      localStorage.setItem(
        "nexoraFriends",
        JSON.stringify(friends)
      );
    } catch (error) {
      console.log("Could not save friends:", error);
    }
  }, [friends]);

  // SELECTEAZA O POZA
  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // STERGE POZA SELECTATA
  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // CREEAZA POSTARE
  const handleCreatePost = () => {
    if (!newPost.trim() && !selectedImage) {
      return;
    }

    const post = {
      id: Date.now(),
      author: currentUserName,
      userId: loggedUser?.id,
      email: loggedUser?.email,
      text: newPost.trim(),
      image: selectedImage,
      likes: 0,
      shares: 0,
      liked: false,
      createdAt: "Just now",
      comments: [],
      showComments: false,
      commentText: "",
    };

    setDemoPosts((currentPosts) => [
      post,
      ...currentPosts,
    ]);

    setNewPost("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // DELETE POST
  const handleDeletePost = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    setDemoPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== id)
    );
  };

  // VERIFICA DACA POSTAREA APARTINE USERULUI LOGAT
  const isOwnPost = (post) => {
    if (
      loggedUser?.id &&
      post.userId &&
      String(post.userId) === String(loggedUser.id)
    ) {
      return true;
    }

    if (
      loggedUser?.email &&
      post.email &&
      post.email === loggedUser.email
    ) {
      return true;
    }

    // Pentru postarile vechi
    if (
      currentUserName &&
      post.author === currentUserName
    ) {
      return true;
    }

    return false;
  };

  // LIKE
  const handleLike = (id) => {
    setDemoPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked
              ? post.likes - 1
              : post.likes + 1,
          };
        }

        return post;
      })
    );
  };

  // SHARE
  // Momentan doar creste numarul.
  // Il facem functional la pasul urmator.
  const handleShare = (id) => {
    setDemoPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            shares: post.shares + 1,
          };
        }

        return post;
      })
    );
  };

  // ADD / REMOVE FRIEND
  const handleAddFriend = (id) => {
    setFriends((currentFriends) =>
      currentFriends.map((friend) => {
        if (friend.id === id) {
          return {
            ...friend,
            added: !friend.added,
          };
        }

        return friend;
      })
    );
  };

  // SHOW / HIDE COMMENTS
  const handleToggleComments = (id) => {
    setDemoPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              showComments: !post.showComments,
            }
          : post
      )
    );
  };

  // COMMENT INPUT
  const handleCommentChange = (id, value) => {
    setDemoPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              commentText: value,
            }
          : post
      )
    );
  };

  // ADD COMMENT
  const handleAddComment = (id) => {
    setDemoPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== id) {
          return post;
        }

        if (!post.commentText.trim()) {
          return post;
        }

        const newComment = {
          id: Date.now(),
          author: currentUserName,
          userId: loggedUser?.id,
          email: loggedUser?.email,
          text: post.commentText.trim(),
        };

        return {
          ...post,
          comments: [...post.comments, newComment],
          commentText: "",
        };
      })
    );
  };

  // VERIFICA DACA UN COMENTARIU APARTINE USERULUI LOGAT
  const isOwnComment = (comment) => {
    if (
      loggedUser?.id &&
      comment.userId &&
      String(comment.userId) === String(loggedUser.id)
    ) {
      return true;
    }

    if (
      loggedUser?.email &&
      comment.email &&
      comment.email === loggedUser.email
    ) {
      return true;
    }

    // Fallback pentru comentariile vechi
    if (
      currentUserName &&
      comment.author === currentUserName
    ) {
      return true;
    }

    return false;
  };

 // DELETE COMMENT
const handleDeleteComment = (postId, commentId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmDelete) {
    return;
  }

  setDemoPosts((currentPosts) =>
    currentPosts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const commentToDelete = post.comments.find(
        (comment) => comment.id === commentId
      );

      if (!commentToDelete) {
        return post;
      }

      // Poti sterge comentariul daca:
      // 1. comentariul este al tau
      // SAU
      // 2. postarea este a ta
      const canDelete =
        isOwnComment(commentToDelete) || isOwnPost(post);

      if (!canDelete) {
        return post;
      }

      return {
        ...post,
        comments: post.comments.filter(
          (comment) => comment.id !== commentId
        ),
      };
    })
  );
};

  // ENTER = CREATE POST
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreatePost();
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* LEFT SIDE */}
      <aside className={styles.leftSide}>
        <div className={styles.sideCard}>
          <div className={styles.profileCard}>
            <img
              src={profile}
              alt={currentUserName}
            />

            <h4>{currentUserName}</h4>

            <span>Welcome back 👋</span>
          </div>

          <Link
            to="/"
            className={styles.menuItem}
          >
            🏠 Home
          </Link>

          <Link
            to="/profile/1"
            className={styles.menuItem}
          >
            👤 My Profile
          </Link>

          <Link
            to="/friends"
            className={styles.menuItem}
          >
            👥 Friends
          </Link>

          <Link
            to="/reels"
            className={styles.menuItem}
          >
            🎬 Reels
          </Link>

          <Link
            to="/settings"
            className={styles.menuItem}
          >
            ⚙️ Settings
          </Link>
        </div>
      </aside>

      {/* CENTER FEED */}
      <section className={styles.feedSection}>
        {/* CREATE POST */}
        <div
          className={styles.createPost}
          id="create-post"
        >
          <div className={styles.createTop}>
            <img
              src={profile}
              alt={currentUserName}
            />

            <input
              id="create-post-input"
              type="text"
              placeholder={`What's on your mind, ${currentUserName}?`}
              value={newPost}
              onChange={(event) =>
                setNewPost(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.createActions}>
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              📷 Photo
            </button>

            <button type="button">
              🎥 Video
            </button>

            <button type="button">
              😊 Feeling
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: "none" }}
            />
          </div>

          {selectedImage && (
            <div className={styles.imagePreview}>
              <img
                src={selectedImage}
                alt="Preview"
              />

              <button
                type="button"
                onClick={handleRemoveSelectedImage}
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="button"
            className={styles.postButton}
            onClick={handleCreatePost}
            disabled={
              !newPost.trim() &&
              !selectedImage
            }
          >
            Post
          </button>
        </div>

        {/* POSTARI DIN API */}
        {postList.length > 0 &&
          postList.map((post) => (
            <Newsfeed
              key={post.id}
              postData={post}
            />
          ))}

        {/* POSTARI LOCALE */}
        {demoPosts.map((post) => (
          <div
            className={styles.demoPost}
            key={post.id}
          >
            <div className={styles.demoPostHeader}>
              <img
                src={profile}
                alt={post.author}
              />

              <div>
                <h4>{post.author}</h4>
                <span>{post.createdAt}</span>
              </div>

              {isOwnPost(post) && (
                <button
                  type="button"
                  className={styles.deletePostButton}
                  onClick={() =>
                    handleDeletePost(post.id)
                  }
                  title="Delete post"
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            {post.text && (
              <p>{post.text}</p>
            )}

            {post.image ? (
              <img
                src={post.image}
                alt="Post"
                className={styles.postImage}
              />
            ) : (
              <div className={styles.postPlaceholder}>
                📸

                <span>
                  Share your moments on Nexora
                </span>
              </div>
            )}

            <div className={styles.postInfo}>
              <span>
                ❤️ {post.likes} likes
              </span>

              <span>
                💬 {post.comments.length} comments
              </span>

              <span>
                🔁 {post.shares} shares
              </span>
            </div>

            <div className={styles.postActions}>
              <button
                type="button"
                onClick={() =>
                  handleLike(post.id)
                }
              >
                {post.liked
                  ? "💜 Liked"
                  : "👍 Like"}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleToggleComments(post.id)
                }
              >
                💬 Comment
              </button>

              <button
                type="button"
                onClick={() =>
                  handleShare(post.id)
                }
              >
                ↗ Share
              </button>
            </div>

            {/* COMMENTS */}
            {post.showComments && (
              <div className={styles.commentsSection}>
                <div className={styles.commentInputRow}>
                  <img
                    src={profile}
                    alt={currentUserName}
                  />

                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={post.commentText}
                    onChange={(event) =>
                      handleCommentChange(
                        post.id,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleAddComment(post.id);
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleAddComment(post.id)
                    }
                  >
                    Send
                  </button>
                </div>

                {post.comments.length > 0 && (
                  <div className={styles.commentsList}>
                    {post.comments.map((comment) => (
                      <div
                        className={styles.comment}
                        key={comment.id}
                      >
                        <img
                          src={profile}
                          alt={comment.author}
                        />

                        <div>
                          <strong>
                            {comment.author}
                          </strong>

                          <p>{comment.text}</p>
                        </div>

                        {/* DELETE COMMENT */}
                        {isOwnComment(comment) && (
                          <button
                            type="button"
                            className={
                              styles.deleteCommentButton
                            }
                            onClick={() =>
                              handleDeleteComment(
                                post.id,
                                comment.id
                              )
                            }
                            title="Delete comment"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* RIGHT SIDE */}
      <aside className={styles.rightSide}>
        <div className={styles.sideCard}>
          <h3>Suggested Friends</h3>

          {friends.map((friend) => (
            <div
              className={styles.friend}
              key={friend.id}
            >
              <img
                src={profile}
                alt={friend.name}
              />

              <span>{friend.name}</span>

              <button
                type="button"
                onClick={() =>
                  handleAddFriend(friend.id)
                }
              >
                {friend.added
                  ? "Added ✓"
                  : "Add"}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.sideCard}>
          <h3>Nexora</h3>

          <p>
            Connect with friends, discover new content
            and share your moments.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default HomePage;