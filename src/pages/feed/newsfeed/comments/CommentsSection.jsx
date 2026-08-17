import styles from "./CommentsSection.module.scss";
import profile from '../../../../assets/profile.webp';

const CommentsSection = () => {
  return (
    <div className={styles.userComments}>
      <div className={styles.commentContent}>
        <div className={styles.profileUserComment}>
          <a href="#">
            <img src={profile} alt="" className={styles.profileImage} />
          </a>
          <span>User name</span>
        </div>
        <div className={styles.userCommentText}>
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti
            fugiat, iure consequuntur ex dolores eius culpa eaque voluptatibus
            soluta eum.
          </div>
          <div className={styles.emojiReaction}>😎</div>
          <span>Remove this comment</span>
        </div>
        <div className={styles.commentReaction}>
          <strong className={styles.commentReactionButton}>Like</strong>
          <strong className={styles.commentReactionButton}>Comment</strong>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
