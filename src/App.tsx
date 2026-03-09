import { Route, Routes } from 'react-router-dom'
import styles from './App.module.css'
import HomePage from './pages/Home/HomePage'
import SchedulePage from './pages/Calendar/CalendarPage'
import Header from './components/layout/Header/Header'
import CertManage from './pages/CertManage/CertManage'
import CertSearch from './pages/CertSearch/CertSearch'
import MyPage from './pages/MyPage/MyPage'
import Footer from './components/layout/Footer/Footer'

function App() {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<SchedulePage />} />
          <Route path="/cert-manage" element={<CertManage />} />
          <Route path="/cert-search" element={<CertSearch />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default App
