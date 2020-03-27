import moment from 'moment'

const prettyDate = ms => {
  const d = moment(ms)
  return d.format("MMM DD ddd")
}

export default prettyDate
