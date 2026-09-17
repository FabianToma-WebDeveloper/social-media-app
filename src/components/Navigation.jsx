import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import styles from "./Navigation.module.scss";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { selectUser } from "../redux/selectors";
import { logout } from "../redux/slices/authSlice";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import MovieIcon from "@mui/icons-material/Movie";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const Navigation = () => {
  const user = useSelector(selectUser);

  const isLoggedIn = user.isAuthenticated;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      dispatch(logout());
      navigate("/auth");
    } else {
      navigate("/auth");
    }

    handleClose();
  };

  return (
    <header>
      <Link
        to="/"
        className={styles.logoLink}
      >
        <div className={styles.logo}>
          Nexora
        </div>
      </Link>

      <nav>
        <ul className={styles.menu}>
          {isLoggedIn && (
            <>
              {/* MY PROFILE */}
              <li className={styles.menuItem}>
                <NavLink to="/profile/1">
                  <AccountCircleIcon fontSize="small" />
                  My Profile
                </NavLink>
              </li>

              {/* FRIENDS */}
              <li className={styles.menuItem}>
                <NavLink to="/friends">
                  <GroupIcon fontSize="small" />
                  Friends
                </NavLink>
              </li>

              {/* MESSAGES */}
              <li className={styles.menuItem}>
                <NavLink to="/messages">
                  <ChatIcon fontSize="small" />
                  Messages
                </NavLink>
              </li>

              {/* REELS */}
              <li className={styles.menuItem}>
                <NavLink to="/reels">
                  <MovieIcon fontSize="small" />
                  Reels
                </NavLink>
              </li>
            </>
          )}

          {/* LOGIN / LOGOUT */}
          <li className={styles.menuItem}>
            <button
              type="button"
              className={styles.authButton}
              onClick={handleAuth}
            >
              {isLoggedIn ? (
                <>
                  <LogoutIcon fontSize="small" />
                  Logout
                </>
              ) : (
                <>
                  <LoginIcon fontSize="small" />
                  Login
                </>
              )}
            </button>
          </li>
        </ul>

        {/* MOBILE BURGER BUTTON */}
        <IconButton
          className={styles.burgerButton}
          aria-label="Open navigation menu"
          onClick={handleOpen}
          size="large"
        >
          <MenuIcon />
        </IconButton>

        {/* MOBILE MENU */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
        >
          {isLoggedIn && (
            <>
              {/* MY PROFILE */}
              <MenuItem
                onClick={() =>
                  handleNavigate("/profile/1")
                }
              >
                <AccountCircleIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />

                My Profile
              </MenuItem>

              {/* FRIENDS */}
              <MenuItem
                onClick={() =>
                  handleNavigate("/friends")
                }
              >
                <GroupIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />

                Friends
              </MenuItem>

              {/* MESSAGES */}
              <MenuItem
                onClick={() =>
                  handleNavigate("/messages")
                }
              >
                <ChatIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />

                Messages
              </MenuItem>

              {/* REELS */}
              <MenuItem
                onClick={() =>
                  handleNavigate("/reels")
                }
              >
                <MovieIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />

                Reels
              </MenuItem>
            </>
          )}

          {/* LOGIN / LOGOUT */}
          <MenuItem onClick={handleAuth}>
            {isLoggedIn ? (
              <>
                <LogoutIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />

                Logout
              </>
            ) : (
              <>
                <LoginIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />

                Login
              </>
            )}
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};

export default Navigation;