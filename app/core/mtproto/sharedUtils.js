export function nextRandomInt(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

export function uintToInt (val) {
  if (val > 2147483647) {
    val = val - 4294967296
  }
  return val
}