/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
const isTrue = (val) => String(val).toLowerCase() === 'true'
const transformBoolean = (val, defaultValue = true) => {
  if (val === undefined || val === null) {
    return defaultValue !== undefined ? defaultValue : null
  }
  return isTrue(val)
}
const transformEmpty = (val) => (!val ? null : val)

const transformEmptyString = (val) => (!val ? '' : val)

const transformEmptyJSON = (val) => (val === undefined || val === null ? null : val)

const transformNumber = (val) => {
  if (!val || isNaN(val)) return null
  return Number(val)
}
const transformArray = (val) => {
  if (typeof val === 'string') {
    let result = val
    if (val.startsWith('{')) {
      result = result.substring(1)
    }

    if (val.endsWith('}')) {
      result = result.substring(0, result.length - 1)
    }
    return result
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) // convert a string to a list split by `,`. this takes into account commas inside quotes
      .map((x) => x.replace(/(^")|("$)/g, ''))
      .filter((x) => !!x)
  }

  return val
}

const concat = (x, y) => x.concat(y)
const flatMap = (f, xs) => xs.map(f).reduce(concat, [])

class MergeMap extends Map {
  set(key, value) {
    return super.set(key, Object.assign(this.get(key) || {}, value))
  }
}

module.exports = {
  flatMap,
  isTrue,
  transformBoolean,
  transformEmpty,
  transformEmptyString,
  transformEmptyJSON,
  transformNumber,
  transformArray,
  MergeMap,
}
