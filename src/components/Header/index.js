import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <div className="nav-list-1">
            <Link to="/" className="nav-link">
              <li>Home</li>
            </Link>
            <Link to="/jobs" className="nav-link">
              <li>Jobs</li>
            </Link>
          </div>
          <div>
            <li>
              <button
                type="button"
                className="logout-bt"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
