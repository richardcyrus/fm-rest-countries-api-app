import { Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import Details from './pages/Details'

export default function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/details/:code">
          <Details />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  )
}
