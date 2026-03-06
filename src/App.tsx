import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Home/HomePage'
import SchedulePage from './pages/Calendar/CalendarPage'

function App() {

  return (
    <div>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/calendar">일정 페이지</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/calendar" element={<SchedulePage/>}/>
      </Routes>
    </div>
  )
}

export default App
