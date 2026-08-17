import styles from "./Newsfeed.module.scss";
import profile from "../../../assets/profile.webp";
import post1 from "../../../assets/post.avif";
import post2 from "../../../assets/post2.webp";

// Material UI IMPORTS
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import CommentsSection from "./comments/CommentsSection";
import { useNavigate } from "react-router-dom";

const Newsfeed = ({ postData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));
  const [isShared, setIsShared] = useState(false);
  const [shares, setShares] = useState(Math.floor(Math.random() * 100));

  const postImages = [post1, post2];

  const navigate = useNavigate();

  const handleLike = () => {
    if (!isLiked) {
      setLikes((prevState) => prevState + 1);
    } else {
      setLikes((prevState) => prevState - 1);
    }

    setIsLiked((prevState) => !prevState);
  };

  const handleShare = () => {
    setShares((prevState) => prevState + 1);
    setIsShared(true);
  };

  const goToProfilePage = () => {
    navigate(`/profile/${postData.id}`);
  }

  return (
    <div className={styles.mainPost}>
      <div className={styles.post}>
        <div className={styles.postHeader}>
          <div
  className={styles.profileUserInfo}
  onClick={goToProfilePage}
>
  <img
    src={profile}
    alt="Profile"
    className={styles.profileImage}
  />

  <span>Sergiu Savin</span>

  <span>08 Apr 2026</span>
</div>

          <div className={styles.profileOptionsWrapper}>
            <button className={styles.profileOptions}>
              <MoreHorizIcon />
            </button>

            <div className={styles.profileOptionsDropdown}>
              <button>Edit this post</button>
              <button>Remove this post</button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.imgWrapper}>
            <img
              src={postImages[postData.id % 2]}
              alt="post"
              className={styles.imgContent}
            />

            <div className={styles.infoIconWrapper}>
              <div className={styles.infoIcon}>
                <InfoIcon fontSize="large" />
              </div>

              <p className={styles.infoMessage}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam eaque placeat culpa commodi minima. Quod quae quisquam
                ex nulla ut nobis fugit nostrum incidunt eveniet sunt sint sed
                ducimus, dolorem in, vel veniam. Facilis quos numquam iure,
                dolorem exercitationem, nesciunt qui laboriosam sunt sint ut
                iste odio, ducimus cum dolores?
                <a href="landing-page.html">Read more...</a>
              </p>
            </div>
          </div>

          <strong className={styles.postTitle}>
            {postData.title.charAt(0).toUpperCase() + postData.title.slice(1)}
          </strong>

          <p className={styles.postDescription}>
            {postData.description.charAt(0).toUpperCase() + postData.description.slice(1)}
          </p>
          <a href="landing-page.html">Read more...</a>
        </div>

        <div className={styles.reacts}>
          <div className={styles.likesInfo}>
            <ThumbUpIcon />
            <span>{likes}</span> <span> likes</span>
          </div>

          <div className={styles.commentsInfo}>
            <span>{shares}</span> <span>shares</span>
            <ChatIcon />
          </div>
        </div>

        <div className={styles.reactActions}>
          <ul className={styles.actions}>
            <li
              className={`${styles.reaction} ${isLiked ? styles.touched : ""}`}
              onClick={handleLike}
            >
              <ThumbUpIcon />
              <span>Like</span>
            </li>
            <li className={styles.reaction}>
              <ChatIcon />
              <span>Comment</span>
            </li>
            <li
              className={`${styles.reaction} ${isShared ? styles.touched : ""}`}
              onClick={handleShare}
            >
              <ReplyIcon />
              <span>Share</span>
            </li>
          </ul>
        </div>

        <hr />

        <div className={styles.commentSection}>
          <a href="#">
            <img src={profile} alt="" className={styles.profileImage} />
          </a>
          <input
            type="text"
            placeholder="Adauga un comentariu"
            className={styles.newCommentField}
          />
          <div className={styles.wrap}>
            <button
              className={`${styles.insertCommentButton} ${styles.button}`}
            >
              <SendIcon />
            </button>
          </div>
        </div>

        <CommentsSection/>
      </div>
    </div>
  );
};

export default Newsfeed;
