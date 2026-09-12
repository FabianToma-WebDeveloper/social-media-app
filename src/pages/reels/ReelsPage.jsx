import { useState } from "react";
import styles from "./ReelsPage.module.scss";

const ReelsPage = () => {
  const [reels, setReels] = useState([
    {
      id: 1,
      title: "Summer Escape",
      description: "Beautiful views and travel vibes 🌴",
      likes: 124,
      comments: 18,
      shares: 7,
      liked: false,
    },
    {
      id: 2,
      title: "City Nights",
      description: "Late night Nexora moments 🌃",
      likes: 98,
      comments: 11,
      shares: 4,
      liked: false,
    },
    {
      id: 3,
      title: "Weekend Mood",
      description: "Relax, enjoy and recharge ☀️",
      likes: 156,
      comments: 22,
      shares: 9,
      liked: false,
    },
    {
      id: 4,
      title: "Adventure Time",
      description: "Exploring new places with friends 🗺️",
      likes: 203,
      comments: 35,
      shares: 12,
      liked: false,
    },
    {
      id: 5,
      title: "Good Vibes",
      description: "A little positivity for your feed ✨",
      likes: 87,
      comments: 9,
      shares: 3,
      liked: false,
    },
    {
      id: 6,
      title: "Nature Moments",
      description: "Sometimes all you need is fresh air 🌿",
      likes: 174,
      comments: 27,
      shares: 10,
      liked: false,
    },
  ]);

  const handleLike = (id) => {
    setReels((currentReels) =>
      currentReels.map((reel) => {
        if (reel.id !== id) {
          return reel;
        }

        return {
          ...reel,
          liked: !reel.liked,
          likes: reel.liked
            ? reel.likes - 1
            : reel.likes + 1,
        };
      })
    );
  };

  const handleShare = (id) => {
    setReels((currentReels) =>
      currentReels.map((reel) =>
        reel.id === id
          ? {
            ...reel,
            shares: reel.shares + 1,
          }
          : reel
      )
    );
  };

  return (
    <div className={styles.reelsPage}>
      <div className={styles.reelsHeader}>
        <span>Nexora Reels</span>

        <h1>Reels</h1>

        <p>
          Discover short moments, stories and content
          from the Nexora community.
        </p>
      </div>

      <div className={styles.reelsGrid}>
        {reels.map((reel) => (
          <article
            key={reel.id}
            className={styles.reelCard}
          >
            <div className={styles.reelThumbnail}>
              <div className={styles.playButton}>
                ▶
              </div>

              <span className={styles.reelBadge}>
                Reel
              </span>
            </div>

            <div className={styles.reelInfo}>
              <h2>{reel.title}</h2>

              <p>{reel.description}</p>

              <div className={styles.reelStats}>
                <span>
                  ❤️ {reel.likes}
                </span>

                <span>
                  💬 {reel.comments}
                </span>

                <span>
                  🔁 {reel.shares}
                </span>
              </div>

              <div className={styles.reelActions}>
                <button
                  type="button"
                  className={
                    reel.liked
                      ? styles.likedButton
                      : ""
                  }
                  onClick={() =>
                    handleLike(reel.id)
                  }
                >
                  {reel.liked
                    ? "💜 Liked"
                    : "👍 Like"}
                </button>

                <button type="button">
                  💬 Comment
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleShare(reel.id)
                  }
                >
                  ↗ Share
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;