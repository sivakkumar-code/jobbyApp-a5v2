import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import {AiOutlineHome} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import {IoIosLogOut} from 'react-icons/io'
import './index.css'

const Header = props => {
  const onLogoutBtnClick = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <ul className="nav-bar-desktop">
        <Link to="/" className="router-nav-link">
          <li className="website-logo-container">
            <button className="website-logo-btn" type="button">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="desktop-logo"
              />
            </button>
          </li>
        </Link>
        <li className="home-and-jobs-container">
          <Link className="router-nav-link" to="/">
            <p className="nav-page-links">Home</p>
          </Link>
          <Link className="router-nav-link" to="/jobs">
            <p className="nav-page-links">Jobs</p>
          </Link>
        </li>
        <li className="logout-btn-container">
          <button
            className="logout-btn"
            type="button"
            onClick={onLogoutBtnClick}
          >
            Logout
          </button>
        </li>
      </ul>
      <div className="nav-bar-mobile">
        <Link to="/" className="router-nav-link">
          <button className="website-logo-btn" type="button">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="mobile-logo"
            />
          </button>
        </Link>
        <ul className="links-container">
          <li className="home-and-jobs-container">
            <Link className="router-nav-link" to="/">
              <AiOutlineHome className="home-icon" />
            </Link>
          </li>
          <li className="home-and-jobs-container">
            <Link className="router-nav-link" to="/jobs">
              <BsBriefcase className="jobs-icon" />
            </Link>
          </li>
          <li className="logout-btn-container">
            <button
              className="logout-mobile-btn"
              type="button"
              onClick={onLogoutBtnClick}
            >
              <IoIosLogOut className="exit-icon" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
