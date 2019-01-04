interface IIndex {
  start: number,
  end: number
}

interface IResult {
  result: boolean,
  indexes: IIndex[]
}

export function search (needle: string, haystack: string) : IResult {
  const hlen = haystack.length
  const nlen = needle.length

  if (nlen > hlen) {
    return {
      result: false,
      indexes: []
    }
  }

  if (nlen === hlen) {
    return {
      result: needle === haystack,
      indexes: [
        {
          start: 0,
          end: nlen
        }
      ]
    }
  }

  const indexes: IIndex[] = []
  let start = null
  let end = null

  outer: for (let i = 0, j = 0; i < nlen; i++) { // eslint-disable-line
    const nch = needle.charCodeAt(i)

    while (j < hlen) {
      if (haystack.charCodeAt(j) === nch) {
        if (start === null) {
          start = j
        }
        end = ++j
        continue outer // eslint-disable-line
      }

      if (start !== null) {
        indexes.push({ start, end })
        start = null
      }
      j++
    }

    return {
      result: false,
      indexes
    }
  }

  if (start !== null) {
    indexes.push({ start, end })
  }

  return {
    result: indexes.length > 0,
    indexes
  }
}
