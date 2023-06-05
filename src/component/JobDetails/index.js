import {Component} from 'react'
import {GoLocation, GoLinkExternal} from 'react-icons/go'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobsCard from '../JobsCard'
import './index.css'

const fetchJobDetailsStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    whatToDisplayOnJobDetails: fetchJobDetailsStatus.loading,
  }

  componentDidMount() {
    this.makeJobDetailsFetch()
  }

  makeJobDetailsFetch = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
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
      const {job_details: jobDetails, similar_jobs: similarJobs} = responseData
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        lifeAtCompany: jobDetails.life_at_company,
        companyWebsiteUrl: jobDetails.company_website_url,
        skills: jobDetails.skills,
      }
      const updatedSimilarJobs = similarJobs.map(item => ({
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
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        whatToDisplayOnJobDetails: fetchJobDetailsStatus.success,
      })
    } else {
      this.setState({whatToDisplayOnJobDetails: fetchJobDetailsStatus.failure})
    }
  }

  onProfileFetchFailure = () => (
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
        onClick={() => this.makeJobDetailsFetch()}
      >
        Retry
      </button>
    </div>
  )

  onFetchJobDetailsSuccess = () => {
    const {jobDetails, similarJobs} = this.state

    return (
      <>
        <div className="job-details-card">
          <div className="jobs-card-container">
            <div className="rating-container">
              <img
                src={jobDetails.companyLogoUrl}
                alt="job details company logo"
                className="comp-logo"
              />
              <div className="rating-typo-container">
                <h1 className="main-role">{jobDetails.title}</h1>
                <div className="rating-act-container">
                  <AiFillStar className="rating-icon" />
                  <p className="rating-num">{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-container">
              <div className="location-and-emp-container">
                <div className="location-box">
                  <GoLocation className="location-icon" />
                  <p className="location-para">{jobDetails.location}</p>
                </div>
                <div className="employment-box">
                  <BsBriefcase className="emp-type-icon" />
                  <p className="emp-type-para">{jobDetails.employmentType}</p>
                </div>
              </div>
              <p className="salary-para">{jobDetails.packagePerAnnum}</p>
            </div>
            <div className="desc-container">
              <div className="desc-link-container">
                <h1 className="common-title">Description</h1>
                <a className="visit-link" href={jobDetails.companyWebsiteUrl}>
                  Visit <GoLinkExternal className="external-link-icon" />
                </a>
              </div>
              <p className="common-para">{jobDetails.jobDescription}</p>
            </div>
            <div className="skills-container">
              <h1 className="common-title">Skills</h1>
              <ul className="skills-ul-list-container">
                {jobDetails.skills.map(item => {
                  const updatedItem = {
                    name: item.name,
                    imageUrl: item.image_url,
                  }
                  return (
                    <li
                      key={updatedItem.name}
                      className="skills-list-container"
                    >
                      <img
                        src={updatedItem.imageUrl}
                        alt={updatedItem.name}
                        className="tech-skills-img"
                      />
                      <p className="skills-para">{updatedItem.name}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="life-at-company-container">
              <h1 className="common-title">Life at Company</h1>
              <div className="life-at-typo-img">
                <p className="common-para">
                  {jobDetails.lifeAtCompany.description}
                </p>
                <img
                  src={jobDetails.lifeAtCompany.image_url}
                  alt="life at company"
                  className="job-details-life-img"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-cards">
            {similarJobs.map(item => (
              <JobsCard
                key={item.id}
                object={item}
                altVal="similar job company logo"
                similarJobs="true"
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayContentJobDesc = () => {
    const {whatToDisplayOnJobDetails} = this.state

    switch (whatToDisplayOnJobDetails) {
      case fetchJobDetailsStatus.success:
        return this.onFetchJobDetailsSuccess()
      case fetchJobDetailsStatus.failure:
        return this.onProfileFetchFailure()
      case fetchJobDetailsStatus.loading:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <div className="job-details-responsive">
          <Header />
          <div className="job-details-main-container">
            {this.displayContentJobDesc()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobDetails
