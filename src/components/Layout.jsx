import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import styles from "./Layout.module.scss";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />

      <main className={styles.mainContent}>
        {children}
      </main>

      <MobileNavigation />
    </>
  );
};

export default Layout;