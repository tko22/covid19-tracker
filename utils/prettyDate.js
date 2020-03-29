import moment from 'moment'

const prettyDate = (ms, chart) => {
  const d = moment(ms)
  return !chart ? d.format("MMM DD ddd") : d.format("M/D")
}

export default prettyDate
