// import {Link} from 'react-router-dom'
import {GoLocation} from 'react-icons/go'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import './index.css'

const JobsCard = props => {
  const {object, altVal, similarJobs} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = object

  return (
    <li className="jobs-card-container">
      <div className="rating-container">
        <img src={companyLogoUrl} alt={altVal} className="comp-logo" />
        <div className="rating-typo-container">
          <h1 className="main-role">{title}</h1>
          <div className="rating-act-container">
            <AiFillStar className="rating-icon" />
            <p className="rating-num">{rating}</p>
          </div>
        </div>
      </div>
      <div
        className={
          similarJobs === 'false'
            ? 'location-container'
            : 'location-container-similar-job'
        }
      >
        <div className="location-and-emp-container">
          <div className="location-box">
            <GoLocation className="location-icon" />
            <p className="location-para">{location}</p>
          </div>
          <div className="employment-box">
            <BsBriefcase className="emp-type-icon" />
            <p className="emp-type-para">{employmentType}</p>
          </div>
        </div>
        <p className="salary-para">{packagePerAnnum}</p>
      </div>
      <div
        className={
          similarJobs === 'false'
            ? 'desc-container'
            : 'desc-container-similar-job'
        }
      >
        <h1 className="common-title">Description</h1>
        <p className="common-para">{jobDescription}</p>
      </div>
    </li>
  )
}

export default JobsCard

//  <Link to={`/jobs/${id}`} className="job-details-nav-link">
