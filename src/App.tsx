import styles from './App.module.css'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Router from './routes/Router'

function App() {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>

      <main className={styles.main}>
        <Router/>
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default App
