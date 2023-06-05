import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute'
import Login from './component/Login'
import Home from './component/Home'
import Jobs from './component/Jobs'
import JobDetails from './component/JobDetails'
import NotFound from './component/NotFound'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobDetails} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
