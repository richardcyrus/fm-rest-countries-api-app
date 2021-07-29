import { Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import Details from './pages/Details'

export default function App() {
  return (
    <Switch>
      <Route path="/details/:code">
        <Details />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}
