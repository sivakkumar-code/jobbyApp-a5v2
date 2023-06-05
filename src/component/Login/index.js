import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeUsername = e => this.setState({username: e.target.value})

  onChangePassword = e => this.setState({password: e.target.value})

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    const {history} = this.props
    history.replace('/')
  }

  loginRequest = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const responseData = await response.json()
    if (response.ok) {
      this.onLoginSuccess(responseData.jwt_token)
    } else {
      this.setState({errorMsg: responseData.error_msg})
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container-login">
        <div className="login-responsive-container">
          <div className="login-main-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="login-logo-img"
            />
            <form className="login-form-container" onSubmit={this.loginRequest}>
              <div className="login-input-container">
                <label htmlFor="username" className="login-input-label">
                  username
                </label>
                <input
                  className="login-input-ele"
                  id="username"
                  type="text"
                  placeholder="Username"
                  onChange={this.onChangeUsername}
                  value={username}
                />
              </div>
              <div className="login-input-container">
                <label htmlFor="password" className="login-input-label">
                  password
                </label>
                <input
                  className="login-input-ele"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.onChangePassword}
                  value={password}
                />
              </div>
              <button className="login-btn" type="submit">
                Login
              </button>
              {errorMsg.length !== 0 && (
                <p className="login-error-msg">{`*${errorMsg}`}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
