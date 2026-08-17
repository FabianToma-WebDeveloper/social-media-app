import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.scss";

const ProfilePage = () => {
  const { id } = useParams();

  return (
    <div className={styles.profilePage}>
      <div className={styles.cover}></div>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          👤
        </div>

        <div className={styles.profileInfo}>
          <div>
            <h1>Fabian Toma</h1>
            <p>@fabian.toma</p>
          </div>

          <button className={styles.editButton}>
            Edit Profile
          </button>
        </div>

        <p className={styles.bio}>
          Welcome to my Nexora profile 👋
          <br />
          Connecting with friends and sharing moments.
        </p>

        <div className={styles.stats}>
          <div>
            <strong>128</strong>
            <span>Friends</span>
          </div>

          <div>
            <strong>24</strong>
            <span>Posts</span>
          </div>

          <div>
            <strong>86</strong>
            <span>Following</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.postsCard}>
          <h2>My Posts</h2>

          <div className={styles.emptyPosts}>
            <div className={styles.emptyIcon}>📝</div>

            <h3>No posts yet</h3>

            <p>
              Your posts will appear here when you
              share something with your friends.
            </p>

            <button className={styles.createButton}>
              Create a post
            </button>
          </div>
        </section>

        <aside className={styles.aboutCard}>
          <h2>About</h2>

          <p>📍 Romania</p>
          <p>📧 fabian@example.com</p>
          <p>👥 128 friends</p>
          <p>🗓️ Joined Nexora in 2026</p>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;