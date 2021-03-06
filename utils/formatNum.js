// Converts `1234567` => `"1,234,567"
// Does not support decimals yet
const formatNum = (number) => {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : number
}

export default formatNum
