import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Header from '../Header'
import JobsCard from '../JobsCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const fetchJobsStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  noJobsFound: 'NO-JOBS',
}

const fetchProfileStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    empType: [],
    salary: '',
    search: '',
    whatToDisplay: fetchJobsStatus.loading,
    profileDetails: {},
    whatToDisplayOnProfile: fetchProfileStatus.loading,
  }

  componentDidMount() {
    this.makeFetchRequest()
    this.makeProfileFetch()
  }

  makeProfileFetch = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const responseData = await response.json()
    console.log(responseData)
    if (response.ok) {
      let {profile_details: profileDetail} = responseData
      profileDetail = {
        name: profileDetail.name,
        profileUrl: profileDetail.profile_image_url,
        bio: profileDetail.short_bio,
      }
      this.setState({
        profileDetails: profileDetail,
        whatToDisplayOnProfile: fetchProfileStatus.success,
      })
    } else {
      this.setState({
        whatToDisplayOnProfile: fetchProfileStatus.failure,
      })
    }
  }

  makeFetchRequest = async () => {
    const {empType, salary, search} = this.state
    let url
    if (empType.length === 0) {
      url = `https://apis.ccbp.in/jobs?employment_type=${salary}&minimum_package=${salary}&search=${search}`
    } else {
      url = `https://apis.ccbp.in/jobs?employment_type=${empType.join(
        ',',
      )}&minimum_package=${salary}&search=${search}`
    }
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const responseData = await response.json()
    console.log(responseData)
    if (response.ok) {
      const {jobs} = responseData
      if (jobs.length !== 0) {
        const updatedJobs = jobs.map(item => ({
          companyLogoUrl: item.company_logo_url,
          employmentType: item.employment_type,
          id: item.id,
          jobDescription: item.job_description,
          location: item.location,
          packagePerAnnum: item.package_per_annum,
          rating: item.rating,
          title: item.title,
        }))
        this.setState({
          jobsList: updatedJobs,
          whatToDisplay: fetchJobsStatus.success,
        })
      } else {
        this.setState({whatToDisplay: fetchJobsStatus.noJobsFound})
      }
    } else {
      this.setState({whatToDisplay: fetchJobsStatus.failure})
    }
  }

  listenToSearch = e => this.setState({search: e.target.value})

  onSearchBtnClick = () => {
    // e.preventDefault()
    this.makeFetchRequest()
  }

  onCheckboxClick = e =>
    this.setState(prevState => {
      if (e.target.checked === true && e.target.id) {
        const newList = [...prevState.empType]
        newList.push(e.target.id)
        return {empType: newList}
      }
      const removedList = prevState.empType.filter(item => item !== e.target.id)
      return {empType: removedList}
    }, this.makeFetchRequest)

  onRadioClick = e =>
    this.setState({salary: e.target.value}, this.makeFetchRequest)

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onFetchSuccess = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobs-cards-container">
        {jobsList.map(item => (
          <Link
            to={`/jobs/${item.id}`}
            key={item.id}
            className="job-details-nav-link"
          >
            <JobsCard
              key={item.id}
              object={item}
              altVal="company logo"
              similarJobs="false"
            />
          </Link>
        ))}
      </ul>
    )
  }

  onFetchFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="profile-retry"
        type="button"
        onClick={() => this.makeFetchRequest()}
      >
        Retry
      </button>
    </div>
  )

  onNoJobsFound = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-title">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  onProfileFetchSuccess = () => {
    const {profileDetails} = this.state
    const {name, bio, profileUrl} = profileDetails

    return (
      <div className="profile-container">
        <img src={profileUrl} alt="profile" className="profile-pic" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-position-in-job">{bio}</p>
      </div>
    )
  }

  onProfileFetchFailure = () => (
    <div className="button-center">
      <button
        className="profile-retry"
        type="button"
        onClick={() => this.makeProfileFetch()}
      >
        Retry
      </button>
    </div>
  )

  displayContent = () => {
    const {whatToDisplay} = this.state

    switch (whatToDisplay) {
      case fetchJobsStatus.success:
        return this.onFetchSuccess()
      case fetchJobsStatus.failure:
        return this.onFetchFailure()
      case fetchJobsStatus.loading:
        return this.onLoading()
      case fetchJobsStatus.noJobsFound:
        return this.onNoJobsFound()
      default:
        return null
    }
  }

  displayContentProfile = () => {
    const {whatToDisplayOnProfile} = this.state

    switch (whatToDisplayOnProfile) {
      case fetchProfileStatus.success:
        return this.onProfileFetchSuccess()
      case fetchProfileStatus.failure:
        return this.onProfileFetchFailure()
      case fetchProfileStatus.loading:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    const {empType, salary, search} = this.state
    console.log(empType)
    console.log(salary, search)

    return (
      <div className="jobs-container">
        <div className="jobs-responsive-container">
          <Header />
          <div className="jobs-main-container">
            <div className="jobs-search-container">
              <div className="jobs-search-container-holder">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input-ele"
                  onChange={this.listenToSearch}
                  value={search}
                />
                <button
                  className="search-btn"
                  type="button"
                  data-testid="searchButton"
                  onClick={this.onSearchBtnClick}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            <div className="side-bar-section">
              <div className="profile-container-main">
                {this.displayContentProfile()}
              </div>
              <div className="employment-type-container">
                <h1 className="common-side-bar-type">Type of Employment</h1>
                <ul className="checkbox-main-container">
                  {employmentTypesList.map(item => (
                    <li
                      className="checkbox-container"
                      key={item.employmentTypeId}
                    >
                      <input
                        type="checkbox"
                        id={item.employmentTypeId}
                        onClick={this.onCheckboxClick}
                        className="checker"
                      />
                      <label
                        className="jobs-label"
                        htmlFor={item.employmentTypeId}
                      >
                        {item.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="salary-range-container">
                <h1 className="common-side-bar-type">Salary Range</h1>
                <ul className="radio-main-container">
                  {salaryRangesList.map(item => (
                    <li className="radio-container" key={item.salaryRangeId}>
                      <input
                        type="radio"
                        id={item.salaryRangeId}
                        value={item.salaryRangeId}
                        onClick={this.onRadioClick}
                        name="radio-group"
                        className="checker"
                      />
                      <label
                        className="jobs-label"
                        htmlFor={item.salaryRangeId}
                      >
                        {item.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fetch-results-container">
              {this.displayContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
