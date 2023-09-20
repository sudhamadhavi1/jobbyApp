import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstantsProfile = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {
    apiStatusProfile: apiStatusConstantsProfile.initial,
    profileDetails: [],
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({apiStatusProfile: apiStatusConstantsProfile.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedProfile = await response.json()

      const profile = fetchedProfile.profile_details
      const updatedData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatusProfile: apiStatusConstantsProfile.success,
      })
    } else {
      this.setState({
        apiStatusProfile: apiStatusConstantsProfile.failure,
      })
    }
  }

  renderSuccessProfileView = () => {
    const {profileDetails} = this.state

    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="heading">{name}</h1>
        <p className="shortBio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case apiStatusConstantsProfile.success:
        return this.renderSuccessProfileView()
      case apiStatusConstantsProfile.failure:
        return this.renderProfileFailureView()
      case apiStatusConstantsProfile.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Profile
