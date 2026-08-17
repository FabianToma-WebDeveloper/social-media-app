import styles from "./ReelsPage.module.scss";

const ReelsPage = () => {
  return (
    <div className={styles.reelsPage}>
      <h1>Reels</h1>
      <p>Browse short video content here.</p>
      <div className={styles.placeholderGrid}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className={styles.reelCard}>
            <div className={styles.reelThumbnail} />
            <div className={styles.reelInfo}>
              <h3>Reel {index + 1}</h3>
              <p>Short video showcase</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
