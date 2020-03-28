import formatNum from './formatNum'

const printStatVal = (value, population, normalize, factor) => {
  if (normalize && population && value) {
    return formatNum((value / (population / factor)).toFixed(3))
  }
  return value ? formatNum(value) : "n/a"
}

export default printStatVal
