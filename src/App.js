import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './Components/Login'
import NotFound from './Components/NotFound'
import Jobs from './Components/Jobs'
import ProtectedRoute from './Components/ProtectedRoute'
import Home from './Components/Home'
import JobDetails from './Components/JobDetails'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/jobs/:id" component={JobDetails} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
