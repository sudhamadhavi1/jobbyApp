import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Profile from '../Profile'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'initial',
  inprogress: 'inprogress',
  failure: 'failure',
  success: 'success',
}

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

const updatedEmploymentTypesList = employmentTypesList.map(each => ({
  label: each.label,
  employmentTypeId: each.employmentTypeId,
  isChecked: false,
}))

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

class Jobs extends Component {
  state = {
    searchInput: '',
    selectedSalaryRange: '',
    filteredJobsList: updatedEmploymentTypesList,
    apiStatus: apiStatusConstants.initial,
    stringResult: '',
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    this.getJobsList()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobsList}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  outputView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  getJobsList = async () => {
    const {searchInput, stringResult, selectedSalaryRange} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${stringResult}&minimum_package=${selectedSalaryRange}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        filteredJobsList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickCheckbox = event => {
    const t = event.target.value
    console.log(t)
    const indexT = updatedEmploymentTypesList.findIndex(
      each => each.employmentTypeId === t,
    )
    if (indexT !== -1) {
      updatedEmploymentTypesList[
        indexT
      ].isChecked = !updatedEmploymentTypesList[indexT].isChecked
    }

    const checkeditems = updatedEmploymentTypesList.filter(
      each => each.isChecked === true,
    )

    const resultList = checkeditems.map(each => each.employmentTypeId)
    const checkedString = resultList.join(',')
    this.setState({stringResult: checkedString}, this.getJobsList)
  }

  onChangeRadio = event => {
    this.setState({selectedSalaryRange: event.target.value}, this.getJobsList)
  }

  renderSuccessView = () => {
    const {filteredJobsList} = this.state
    if (filteredJobsList.length <= 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <div>
        <ul className="job-list-container">
          {filteredJobsList.map(each => (
            <JobItem jobItemDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div className="job-container">
          <div className="profile-filters-container">
            <Profile />
            <div className="employement-container">
              <hr className="line" />
              <h1 className="heading-filter">Type of Employment</h1>
              <ul className="filter-container">
                {updatedEmploymentTypesList.map(each => (
                  <li key={each.label}>
                    <label>
                      <input
                        type="checkbox"
                        value={each.employmentTypeId}
                        onChange={this.onClickCheckbox}
                      />
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <hr className="line" />
              <h1 className="heading-filter">Salary Range</h1>
              <ul className="filter-container">
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId}>
                    <label>
                      <input
                        type="radio"
                        value={each.salaryRangeId}
                        onChange={this.onChangeRadio}
                        name="salary"
                      />
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="search-jobs-container">
              <input
                type="search"
                onChange={this.onChangeSearchInput}
                placeholder="Search"
                value={searchInput}
                className="input-search"
              />

              <button
                type="button"
                onClick={this.getJobsList}
                data-testid="searchButton"
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            {this.outputView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
