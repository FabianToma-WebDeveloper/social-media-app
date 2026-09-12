import { NavLink, useNavigate } from "react-router-dom";
import styles from "./MobileNavigation.module.scss";

const MobileNavigation = () => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate("/");

    setTimeout(() => {
      const createPost = document.getElementById("create-post");
      const input = document.getElementById("create-post-input");

      createPost?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      input?.focus();
    }, 150);
  };

  return (
    <nav className={styles.mobileNav}>
      <NavLink to="/">
        <span>🏠</span>
        <small>Home</small>
      </NavLink>

      <NavLink to="/friends">
        <span>👥</span>
        <small>Friends</small>
      </NavLink>

      <button
        type="button"
        className={styles.createButton}
        onClick={handleCreatePost}
        aria-label="Create post"
      >
        <span>＋</span>
      </button>

      <NavLink to="/reels">
        <span>🎬</span>
        <small>Reels</small>
      </NavLink>

      <NavLink to="/profile/1">
        <span>👤</span>
        <small>Profile</small>
      </NavLink>
    </nav>
  );
};

export default MobileNavigation;