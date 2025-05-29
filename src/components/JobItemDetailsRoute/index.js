import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {HiExternalLink} from 'react-icons/hi'

import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobItemDetailsList: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetailsList()
  }

  getJobItemDetailsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        jobDetails: {
          companyLogoUrl: fetchedData.job_details.company_logo_url,
          companyWebsiteUrl: fetchedData.job_details.company_website_url,
          employmentType: fetchedData.job_details.employment_type,
          id: fetchedData.job_details.id,
          jobDescription: fetchedData.job_details.job_description,
          title: fetchedData.job_details.title,
          location: fetchedData.job_details.location,
          packagePerAnnum: fetchedData.job_details.package_per_annum,
          rating: fetchedData.job_details.rating,
          skills: fetchedData.job_details.skills.map(each => ({
            name: each.name,
            imageUrl: each.image_url,
          })),
          lifeAtCompany: {
            description: fetchedData.job_details.life_at_company.description,
            imageUrl: fetchedData.job_details.life_at_company.image_url,
          },
        },
        similarJobs: fetchedData.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }

      this.setState({
        jobItemDetailsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button
          type="button"
          onClick={this.getJobItemDetailsList}
          className="retry-btn"
        >
          Retry
        </button>
      </div>
    </>
  )

  renderSuccessView = () => {
    const {jobItemDetailsList} = this.state
    const {jobDetails, similarJobs} = jobItemDetailsList

    return (
      <>
        <Header />
        <div className="job-item-details-con">
          <div className="jidr-job-item-con">
            <div className="job-con-1">
              <img
                src={jobDetails.companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating-con">
                <h3 className="title-h1">{jobDetails.title}</h3>
                <div className="rating-con">
                  <BsStarFill className="star-icon" />
                  <p className="rating">{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-con">
              <div className="location-employment-con">
                <div className="location-icon-con">
                  <FaMapMarkerAlt className="le-icon" />
                  <p>{jobDetails.location}</p>
                </div>
                <div className="employment-icon-con">
                  <BsBriefcaseFill className="le-icon" />
                  <p>{jobDetails.employmentType}</p>
                </div>
              </div>
              <p>{jobDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div className="desc-visit-con">
              <h3>Description</h3>
              <div className="visit-icon-con">
                <a
                  href={jobDetails.companyWebsiteUrl}
                  className="visit-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                </a>
                <HiExternalLink className="visit-icon" />
              </div>
            </div>
            <p>{jobDetails.jobDescription}</p>
            <div className="skills-con">
              <h3>Skills</h3>
              <ul className="skills-list-con">
                {jobDetails.skills.map(each => (
                  <li key={each.name} className="skill-item">
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-imgs"
                    />
                    <p>{each.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="life-at-company-con">
              <h3>Life at Company</h3>
              <div className="life-2-con">
                <p className="life-desc">
                  {jobDetails.lifeAtCompany.description}
                </p>
                <img
                  src={jobDetails.lifeAtCompany.imageUrl}
                  alt="life at company"
                />
              </div>
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs-con">
            {similarJobs.map(each => (
              <li key={each.id} className="similar-job-item">
                <div className="job-con-1">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="title-rating-con">
                    <h3 className="title-h1">{each.title}</h3>
                    <div className="rating-con">
                      <BsStarFill className="star-icon" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <h3>Description</h3>
                <p>{each.jobDescription}</p>
                <div className="location-employment-con">
                  <div className="location-icon-con">
                    <FaMapMarkerAlt className="le-icon" />
                    <p>{each.location}</p>
                  </div>
                  <div className="employment-icon-con">
                    <BsBriefcaseFill className="le-icon" />
                    <p>{each.employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderJobItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return this.renderJobItemDetails()
  }
}

export default JobItemDetailsRoute
