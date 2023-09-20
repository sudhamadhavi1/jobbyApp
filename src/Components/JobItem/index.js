import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'

import {MdWork} from 'react-icons/md'

import {IoLocationSharp} from 'react-icons/io5'
import './index.css'

const JobItem = props => {
  const {jobItemDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItemDetails

  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li key={id} className="list-container">
        <div className="logo-container">
          <img src={companyLogoUrl} alt="company logo" className="logo" />
          <div className="title-rating-container">
            <div>
              <h1 className="title">{title}</h1>
            </div>

            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-salary-container">
          <div className="location-employee-type-container">
            <div className="location-container">
              <IoLocationSharp className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="location-container">
              <MdWork />
              <p>{employmentType}</p>
            </div>
          </div>
          <div>
            <p>{packagePerAnnum}</p>
          </div>
        </div>

        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
