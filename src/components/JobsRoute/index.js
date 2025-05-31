import {Component} from "react"
import {Link} from "react-router-dom"
import Loader from "react-loader-spinner"
import Cookies from "js-cookie"
import {BsSearch, BsStarFill, BsBriefcaseFill} from "react-icons/bs"
import {FaMapMarkerAlt} from "react-icons/fa"

import Header from "../Header"
import "./index.css"

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure1: "FAILURE1", // profile failure
  failure2: "FAILURE2", // jobs failure
  inProgress: "IN_PROGRESS",
}

const employmentTypesList = [
  {label: "Full Time", employmentTypeId: "FULLTIME"},
  {label: "Part Time", employmentTypeId: "PARTTIME"},
  {label: "Freelance", employmentTypeId: "FREELANCE"},
  {label: "Internship", employmentTypeId: "INTERNSHIP"},
]

const salaryRangesList = [
  {salaryRangeId: "1000000", label: "10 LPA and above"},
  {salaryRangeId: "2000000", label: "20 LPA and above"},
  {salaryRangeId: "3000000", label: "30 LPA and above"},
  {salaryRangeId: "4000000", label: "40 LPA and above"},
]

const locationList = [
  {locationId: "HYDERABAD", label: "Hyderabad"},
  {locationId: "BANGALORE", label: "Bangalore"},
  {locationId: "CHENNAI", label: "Chennai"},
  {locationId: "DELHI", label: "Delhi"},
  {locationId: "MUMBAI", label: "Mumbai"},
]

class JobsRoute extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    searchInput: "",
    employmentType: [],
    salaryType: "",
    locationType: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get("jwt_token")
    const apiUrl1 = "https://apis.ccbp.in/profile"
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: "GET",
    }

    const response = await fetch(apiUrl1, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure1})
    }
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchInput, employmentType, salaryType, locationType} = this.state
    const jwtToken = Cookies.get("jwt_token")
    const apiUrl2 = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ",",
    )}&minimum_package=${salaryType}&location_based=${locationType.join(
      ",",
    )}&search=${searchInput}`
    console.log("API URL:", apiUrl2)
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: "GET",
    }

    const response = await fetch(apiUrl2, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map((job) => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure2})
    }
  }

  onChangeSearchInput = (event) => {
    this.setState({searchInput: event.target.value})
  }

  onChangeEmploymentType = (event) => {
    const {employmentType} = this.state
    const {value} = event.target

    if (employmentType.includes(value)) {
      this.setState(
        (prevState) => ({
          employmentType: prevState.employmentType.filter((type) => type !== value),
        }),
        this.getJobsList,
      )
    } else {
      this.setState(
        (prevState) => ({
          employmentType: [...prevState.employmentType, value],
        }),
        this.getJobsList,
      )
    }
  }

  onChangeSalaryType = (event) => {
    this.setState({salaryType: event.target.value}, this.getJobsList)
  }

  onChangeLocation = (event) => {
    const {value} = event.target
    const {locationType} = this.state

    if (locationType.includes(value)) {
      this.setState(
        (prevState) => ({
          locationType: prevState.locationType.filter((loc) => loc !== value),
        }),
        this.getJobsList,
      )
    } else {
      this.setState(
        (prevState) => ({
          locationType: [...prevState.locationType, value],
        }),
        this.getJobsList,
      )
    }
  }

  renderProfileSection = () => {
    const {profileApiStatus, profileDetails} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure1:
        return (
          <div className="failure-con-profile">
            <button type="button" onClick={this.getProfileDetails} className="retry-btn">
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.success:
        return (
          <div className="profile-con">
            <img src={profileDetails.profileImageUrl} alt="profile" />
            <h1 className="jr-h1-fc name">{profileDetails.name}</h1>
            <p className="short-bio">{profileDetails.shortBio}</p>
          </div>
        )
      default:
        return null
    }
  }

  renderJobsListView = () => {
    const {jobsApiStatus, jobsList, locationType} = this.state

    const filteredJobs =
      locationType.length === 0
        ? jobsList
        : jobsList.filter((job) =>
            locationType.some(
              (loc) => job.location.toLowerCase().trim() === loc.toLowerCase().trim(),
            ),
          )

    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure2:
        return (
          <div className="job-failure-con">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="job-failure-view-img"
            />
            <h1 className="job-failure-view-heading">Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={this.getJobsList} className="retry-btn">
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.success:
        if (filteredJobs.length === 0) {
          return (
            <div className="jobs-not-found-con">
              <img src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png" alt="no jobs" />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters.</p>
            </div>
          )
        }

        return (
          <ul className="jobs-con">
            {filteredJobs.map((each) => (
              <Link to={`/jobs/${each.id}`} className="link" key={each.id}>
                <li className="job-list-item">
                  <div className="job-con-1">
                    <img src={each.companyLogoUrl} alt="company logo" className="company-logo" />
                    <div className="title-rating-con">
                      <h3 className="title-h1">{each.title}</h3>
                      <div className="rating-con">
                        <BsStarFill className="star-icon" />
                        <p className="rating">{each.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="location-con">
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
                    <p>{each.packagePerAnnum}</p>
                  </div>
                  <hr />
                  <h3>Description</h3>
                  <p>{each.jobDescription}</p>
                </li>
              </Link>
            ))}
          </ul>
        )
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div className="loader-con" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {searchInput, employmentType, salaryType, locationType} = this.state

    return (
      <>
        <Header />
        <div className="outer-con">
          <div className="first-con">
            {/* Profile Section */}
            {this.renderProfileSection()}
            <hr />
            <ul className="employment-con">
              <h1 className="employment-heading">Type of Employment</h1>
              {employmentTypesList.map((each) => (
                <li key={each.employmentTypeId} className="list-item-con">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={each.employmentTypeId}
                    checked={employmentType.includes(each.employmentTypeId)}
                    onChange={this.onChangeEmploymentType}
                    id={each.employmentTypeId}
                  />
                  <label htmlFor={each.employmentTypeId} className="label">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <div className="salary">
              <h1 className="salary-heading">Salary Range</h1>
              <ul className="salary-con">
                {salaryRangesList.map((each) => (
                  <li key={each.salaryRangeId} className="salary-list-item">
                    <input
                      type="radio"
                      name="salary"
                      value={each.salaryRangeId}
                      id={each.salaryRangeId}
                      checked={salaryType === each.salaryRangeId}
                      onChange={this.onChangeSalaryType}
                      className="salary-radio"
                    />
                    <label htmlFor={each.salaryRangeId} className="label">
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <ul className="location-con-list">
              <h1 className="location-heading">Location</h1>
              {locationList.map((each) => (
                <li key={each.locationId} className="list-item-con">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={each.locationId}
                    checked={locationType.includes(each.locationId)}
                    onChange={this.onChangeLocation}
                    id={each.locationId}
                  />
                  <label htmlFor={each.locationId} className="label">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="second-con">
            <div className="search-con">
              <input
                placeholder="Search"
                type="search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                className="search-input"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-bt"
                onClick={this.getJobsList}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {/* Jobs List */}
            {this.renderJobsListView()}
          </div>
        </div>
      </>
    )
  }
}

export default JobsRoute
