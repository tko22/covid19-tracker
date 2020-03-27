const printStatVal = (value, population, normalize, factor) => {
  if (normalize && population && value) {
    return (value / (population / factor)).toFixed(3)
  }
  return value || "n/a"
}

export default printStatVal
