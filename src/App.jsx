import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import Details from './pages/Details'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/details/:code" element={<Details />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}
