
const getHospitalizedIncr = (data) => {
  return data.map((day, index) => {
    const newDay = day
    if (day.hospitalizedCurrently == undefined) {
      newDay.hospitalizedCurrently = 0
    }
    if (index === data.length - 1) {
      newDay.hospitalizedIncrease = 0
      return newDay
    }
    const nextDayHos = data[index + 1].hospitalizedCurrently != undefined ? data[index + 1].hospitalizedCurrently : 0
    newDay.hospitalizedIncrease = newDay.hospitalizedCurrently - nextDayHos
    return newDay
  })
}

export default getHospitalizedIncr
