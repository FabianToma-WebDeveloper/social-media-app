import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Newsfeed from "../feed/newsfeed/Newsfeed";
import styles from "./HomePage.module.scss";
import feedService from "../../services/feedService";
import profile from "../../assets/profile.webp";

const HomePage = () => {
  // Folosit pentru datele vechi, dacă este nevoie
  const posts = useFetch("https://jsonplaceholder.typicode.com/posts");
  
  const [postList, setPostList] = useState([]);
  
  useEffect(() => {
    async function getPosts() {
      const response = await feedService.get();
      setPostList(response);
      return response;
    }

    getPosts().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div className={styles.mainContainer}>

      {/* LEFT SIDE */}
      <aside className={styles.leftSide}>
        <div className={styles.sideCard}>

          <div className={styles.profileCard}>
            <img src={profile} alt="Profile" />
            <h4>Fabian Toma</h4>
            <span>Welcome back 👋</span>
          </div>

          <a href="/" className={styles.menuItem}>
            🏠 Home
          </a>

          <a href="/profile/1" className={styles.menuItem}>
            👤 My Profile
          </a>

          <a href="/friends" className={styles.menuItem}>
            👥 Friends
          </a>

          <a href="/reels" className={styles.menuItem}>
            🎬 Reels
          </a>

          <a href="#" className={styles.menuItem}>
            ⚙️ Settings
          </a>

        </div>
      </aside>


      {/* Postari */}
      <section>
        {postList?.map((post) => {
          return (
            <Newsfeed
              key={post.id}
              postData={post}
            />
          );
        })}
      </section>


      {/* RIGHT SIDE */}
      <aside className={styles.rightSide}>

        <div className={styles.sideCard}>
          <h3>Suggested Friends</h3>

          <div className={styles.friend}>
            <img src={profile} alt="Alex" />
            <span>Alex</span>
            <button>Add</button>
          </div>

          <div className={styles.friend}>
            <img src={profile} alt="Maria" />
            <span>Maria</span>
            <button>Add</button>
          </div>

          <div className={styles.friend}>
            <img src={profile} alt="David" />
            <span>David</span>
            <button>Add</button>
          </div>
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