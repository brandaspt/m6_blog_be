import _ from "lodash"

export const filterObject = (obj, keys) => {
  return _.pick(obj, keys)
}
