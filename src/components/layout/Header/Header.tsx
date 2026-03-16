import { Link } from "react-router-dom"
import styles from "./Header.module.css"

function Header() {
  return (
    <header className={styles.header}>

      <Link to="/" className={styles.logo}>
        OVC
      </Link>

      <div className={styles.right}>
        <Link to="/calendar" className={styles.link}>일정</Link>
        <Link to="/cert-search" className={styles.link}>자격증 탐색</Link>
        <Link to="/cert-manage" className={styles.link}>자격증 관리</Link>
        <Link to="/login" className={styles.link}>로그인</Link>
        <Link to="/mypage" className={styles.mypage}>마이페이지</Link>
      </div>

    </header>
  )
}

export default Header
