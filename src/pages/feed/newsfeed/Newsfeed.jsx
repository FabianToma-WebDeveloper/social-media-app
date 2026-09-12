import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Newsfeed.module.scss";

import profile from "../../../assets/profile.webp";
import post1 from "../../../assets/post.avif";
import post2 from "../../../assets/post2.webp";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import ReplyIcon from "@mui/icons-material/Reply";

const Newsfeed = ({ postData }) => {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(24);

  const [shares, setShares] = useState(2);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const postImages = [post1, post2];

  const handleLike = () => {
    setIsLiked((currentLiked) => {
      setLikes((currentLikes) =>
        currentLiked
          ? currentLikes - 1
          : currentLikes + 1
      );

      return !currentLiked;
    });
  };

  const handleShare = () => {
    setShares((currentShares) => currentShares + 1);
  };

  const handleToggleComments = () => {
    setShowComments((currentState) => !currentState);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      author: "Fabian Toma",
      text: commentText.trim(),
    };

    setComments((currentComments) => [
      ...currentComments,
      newComment,
    ]);

    setCommentText("");
  };

  const handleCommentKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddComment();
    }
  };

  const goToProfilePage = () => {
    navigate("/profile/1");
  };

  const title = postData?.title || "A new Nexora moment";

  const description =
    postData?.description ||
    "Sharing a new moment with the Nexora community.";

  const imageIndex = postData?.id
    ? postData.id % postImages.length
    : 0;

  return (
    <article className={styles.mainPost}>
      <div className={styles.post}>
        <div className={styles.postHeader}>
          <button
            type="button"
            className={styles.profileUserInfo}
            onClick={goToProfilePage}
          >
            <img
              src={profile}
              alt="Fabian Toma"
              className={styles.profileImage}
            />

            <div>
              <h3>Fabian Toma</h3>
              <span>Recently</span>
            </div>
          </button>

          <button
            type="button"
            className={styles.profileOptions}
            aria-label="Post options"
          >
            <MoreHorizIcon />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.postTitle}>
              {title.charAt(0).toUpperCase() +
                title.slice(1)}
            </h2>

            <p className={styles.postDescription}>
              {description.charAt(0).toUpperCase() +
                description.slice(1)}
            </p>
          </div>

          <img
            src={postImages[imageIndex]}
            alt={title}
            className={styles.imgContent}
          />
        </div>

        <div className={styles.reacts}>
          <span>❤️ {likes} likes</span>

          <div>
            <span>💬 {comments.length} comments</span>
            <span>🔁 {shares} shares</span>
          </div>
        </div>

        <div className={styles.reactActions}>
          <button
            type="button"
            className={`${styles.reaction} ${isLiked ? styles.touched : ""
              }`}
            onClick={handleLike}
          >
            <ThumbUpIcon fontSize="small" />
            <span>
              {isLiked ? "Liked" : "Like"}
            </span>
          </button>

          <button
            type="button"
            className={styles.reaction}
            onClick={handleToggleComments}
          >
            <ChatIcon fontSize="small" />
            <span>Comment</span>
          </button>

          <button
            type="button"
            className={styles.reaction}
            onClick={handleShare}
          >
            <ReplyIcon fontSize="small" />
            <span>Share</span>
          </button>
        </div>

        {showComments && (
          <div className={styles.commentsSection}>
            <div className={styles.commentInputRow}>
              <img
                src={profile}
                alt="Fabian Toma"
                className={styles.commentAvatar}
              />

              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(event) =>
                  setCommentText(event.target.value)
                }
                onKeyDown={handleCommentKeyDown}
              />

              <button
                type="button"
                onClick={handleAddComment}
              >
                Send
              </button>
            </div>

            {comments.length > 0 && (
              <div className={styles.commentsList}>
                {comments.map((comment) => (
                  <div
                    className={styles.comment}
                    key={comment.id}
                  >
                    <img
                      src={profile}
                      alt={comment.author}
                      className={styles.commentAvatar}
                    />

                    <div>
                      <strong>
                        {comment.author}
                      </strong>

                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default Newsfeed;