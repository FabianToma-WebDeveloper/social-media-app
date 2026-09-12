import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsPage.module.scss";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings =
        localStorage.getItem("nexoraSettings");

      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.log("Could not load settings:", error);
    }

    return {
      notifications: true,
      privateAccount: false,
      showEmail: true,
      darkMode: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(
      "nexoraSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
    document.body.classList.toggle(
      "dark-mode",
      settings.darkMode
    );
  }, [settings.darkMode]);

  const handleToggle = (settingName) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [settingName]: !currentSettings[settingName],
    }));
  };

  const handleEditProfile = () => {
    navigate("/profile/1");
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: true,
      privateAccount: false,
      showEmail: true,
      darkMode: false,
    };

    setSettings(defaultSettings);

    localStorage.setItem(
      "nexoraSettings",
      JSON.stringify(defaultSettings)
    );
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <span>Nexora Settings</span>

        <h1>Settings</h1>

        <p>
          Manage your account, privacy and app
          preferences.
        </p>
      </div>

      <div className={styles.settingsLayout}>
        <section className={styles.settingsCard}>
          <div className={styles.sectionTitle}>
            <div>
              <h2>Account</h2>
              <p>
                Manage your profile and account details.
              </p>
            </div>

            <span>👤</span>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3>Edit Profile</h3>

              <p>
                Change your name, username, bio and
                profile information.
              </p>
            </div>

            <button
              type="button"
              className={styles.actionButton}
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
          </div>
        </section>

        <section className={styles.settingsCard}>
          <div className={styles.sectionTitle}>
            <div>
              <h2>Privacy</h2>

              <p>
                Choose how your account appears to
                others.
              </p>
            </div>

            <span>🔒</span>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3>Private Account</h3>

              <p>
                Only approved friends can see your
                content.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.switch} ${
                settings.privateAccount
                  ? styles.switchActive
                  : ""
              }`}
              onClick={() =>
                handleToggle("privateAccount")
              }
              aria-label="Toggle private account"
            >
              <span></span>
            </button>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3>Show Email</h3>

              <p>
                Allow your email to appear in your
                profile information.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.switch} ${
                settings.showEmail
                  ? styles.switchActive
                  : ""
              }`}
              onClick={() =>
                handleToggle("showEmail")
              }
              aria-label="Toggle email visibility"
            >
              <span></span>
            </button>
          </div>
        </section>

        <section className={styles.settingsCard}>
          <div className={styles.sectionTitle}>
            <div>
              <h2>Preferences</h2>

              <p>
                Customize your Nexora experience.
              </p>
            </div>

            <span>⚙️</span>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3>Notifications</h3>

              <p>
                Receive updates for new activity.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.switch} ${
                settings.notifications
                  ? styles.switchActive
                  : ""
              }`}
              onClick={() =>
                handleToggle("notifications")
              }
              aria-label="Toggle notifications"
            >
              <span></span>
            </button>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3>Dark Mode</h3>

              <p>
                Use a darker appearance for Nexora.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.switch} ${
                settings.darkMode
                  ? styles.switchActive
                  : ""
              }`}
              onClick={() =>
                handleToggle("darkMode")
              }
              aria-label="Toggle dark mode"
            >
              <span></span>
            </button>
          </div>
        </section>

        <section
          className={`${styles.settingsCard} ${styles.dangerCard}`}
        >
          <div className={styles.sectionTitle}>
            <div>
              <h2>Reset</h2>

              <p>
                Restore your Nexora preferences to
                default values.
              </p>
            </div>

            <span>↺</span>
          </div>

          <div className={styles.settingRow}>
            <div>
              <h3>Reset Settings</h3>

              <p>
                This only resets app preferences. Your
                posts and profile will not be deleted.
              </p>
            </div>

            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetSettings}
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;