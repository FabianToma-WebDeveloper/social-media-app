import { useState } from "react";
import styles from "./AuthForm.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selectors";
import {
  loginUser,
  registerUser,
} from "../../redux/slices/authSlice";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector(selectUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleAuthState = () => {
    setIsLogin((prevState) => !prevState);

    setEmail("");
    setPassword("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      email: email.trim(),
      password,
    };

    try {
      if (isLogin) {
        await dispatch(loginUser(payload)).unwrap();

        navigate("/");
      } else {
        await dispatch(registerUser(payload)).unwrap();

        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authDecorationOne}></div>
      <div className={styles.authDecorationTwo}></div>

      <div className={styles.auth}>
        <div className={styles.brand}>
          <div className={styles.logo}>N</div>

          <h1>Nexora</h1>
        </div>

        <div className={styles.heading}>
          <h2>
            {isLogin
              ? "Welcome back"
              : "Create your account"}
          </h2>

          <p>
            {isLogin
              ? "Login to continue exploring Nexora."
              : "Join Nexora and start sharing your moments."}
          </p>
        </div>

        <form onSubmit={submitHandler}>
          <div className={styles.control}>
            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className={styles.control}>
            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className={styles.actions}>
            {user.error && (
              <div className={styles.errorMessage}>
                {isLogin
                  ? "Email or password is incorrect."
                  : "Account could not be created. Try another email or password."}
              </div>
            )}

            {user.loading && (
              <div className={styles.loadingMessage}>
                Sending request...
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={user.loading}
            >
              {user.loading
                ? "Please wait..."
                : isLogin
                  ? "Login"
                  : "Create account"}
            </button>

            <div className={styles.divider}>
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            <button
              type="button"
              className={styles.toggle}
              onClick={toggleAuthState}
            >
              {isLogin
                ? "Create new account"
                : "Login with an existing account"}
            </button>
          </div>
        </form>

        <p className={styles.footerText}>
          Connect. Share. Discover.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;