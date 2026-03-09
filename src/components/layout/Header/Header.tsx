import { Link } from "react-router-dom"
import styles from './Header.module.css'

function Header() {
    return (
        <div className={styles.header}>
            <Link to="/" className={styles.link}>OVC</Link>
            <Link to="/calendar" className={styles.link}>일정 페이지</Link>
            <Link to="/cert-manage" className={styles.link}>자격증 관리</Link>
            <Link to="/cert-search" className={styles.link}>자격증 탐색</Link>
            <div className={styles.mypage}>
                <Link to="/mypage" className={styles.link}>마이페이지</Link>
            </div>
        </div>
    )
}

export default Header