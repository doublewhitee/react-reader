export function setNumberFormat(num: number) {
  // 相当于toLocaleString
  // eslint-disable-next-line arrow-body-style
  const res = num.toString().replace(/\d+/, (n) => {
    // 提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, (i) => `${i},`)
  })
  return res
}

export function cutNumber(num: number) {
  const len: number = Math.ceil(num).toString().length
  if (len >= 5) {
    return `${Math.ceil(num / 10000)}万`
  }
  if (len >= 4) {
    return `${Math.ceil(num / 1000)}千`
  }
  return num.toString()
}
