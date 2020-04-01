import moment from 'moment'

// date format is M/D/YYYY
const prettyJHUDate = (date) => {
  return moment(date, "M/D/YYYY").format("M/D")
}

export default prettyJHUDate
