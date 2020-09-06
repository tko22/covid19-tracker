
const ema = (mArray, mRange) => {
  const k = 2 / (mRange + 1)
  // first item is just the same as the first item in the input
  const emaArray = [mArray[0]]
  // for the rest of the items, they are computed with the previous one
  for (var i = 1; i < mArray.length; i++) {
    emaArray.push((mArray[i] * k + emaArray[i - 1] * (1 - k)).toFixed(2))
  }
  return emaArray
}

function sma(arr, range, format) {
  if (!Array.isArray(arr)) {
    throw TypeError('expected first argument to be an array')
  }

  var num = range
  var res = new Array(num).fill(0)
  var len = arr.length + 1
  var idx = num - 1
  while (++idx < len) {
    res.push(toFixed(avg(arr, idx, num)))
  }
  return res
}

function avg(arr, idx, range) {
  return sum(arr.slice(idx - range, idx)) / range
}

function sum(arr) {
  var len = arr.length
  var num = 0
  while (len--) num += Number(arr[len])
  return num
}

function toFixed(n) {
  return n.toFixed(2)
}

export {
  ema,
  sma,
  avg,
  toFixed
}
