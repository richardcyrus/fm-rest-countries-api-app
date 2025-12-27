import { Route, Routes } from 'react-router'

import Header from '~/components/Header'
import Details from '~/pages/Details'
import Home from '~/pages/Home'

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
