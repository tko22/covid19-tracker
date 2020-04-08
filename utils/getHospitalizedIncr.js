
const getHospitalizedIncr = (data) => {
  return data.map((day, index) => {
    if (index === data.length - 1) {
      return day
    }
    day.hospitalizedIncrease = day.hospitalizedCurrently - data[index + 1].hospitalizedCurrently
    return day
  })
}

export default getHospitalizedIncr
