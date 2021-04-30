interface Index {
  start: number,
  end: number
}

interface PartialResult {
  start: number,
  end: number,
  score: number,
  indexes: Index[]
}

interface Result {
  isMatch: boolean,
  score: number,
  indexes: Index[]
}

interface Options {
  caseSensitive?: boolean,
  tag?: string,
}

const NO_MATCH = {
  isMatch: false,
  score: 0,
  indexes: []
}

/**
 * Compare characters considering case sensitivity setting (false by default)
 * @param char A character to find in the haystack
 * @param haystack The input string
 * @param caseSensitive Specify whether the fuzzy search is case sensitive or not (default: false)
 */
 function compareCharacters (needleChar: string, haystackChar: string, caseSensitive: boolean = false) {
  return caseSensitive
    ? needleChar === haystackChar
    : needleChar.toLowerCase() === haystackChar.toLowerCase()
}

/**
 * Get the indexes of all the occurrences of char in the haystack
 * @param char A character to find in the haystack
 * @param haystack The input string
 * @param caseSensitive Specify whether the fuzzy search is case sensitive or not (default: false)
 */
function getStartIndexes (char: string, haystack: string, caseSensitive: boolean) : number[] {
  const indexes : number[] = []

  for (let i = 0; i < haystack.length; i++) {
    if (compareCharacters(char, haystack[i], caseSensitive)) {
      indexes.push(i)
    }
  }

  return indexes
}

interface TraverseHaystackParams {
  needle: string,
  haystack: string,
  needleIndex: number,
  haystackIndex: number,
  indexes?: Index[],
  start?: number,
  end?: number,
  score?: number,
  caseSensitive: boolean,
}

/**
 * Recursively traverses the haystack looking for the needle.
 * Returns the last match's start and end indexes, the array of previously gathered indexes
 * and the highest score so far
 * @param needle The string to fuzzy-find in the haystack
 * @param haystack The input string
 * @param needleIndex Current position in the needle
 * @param haystackIndex Current position in the haystack
 * @param indexes Array of start-end indexes of needle's characters matched in the haystack
 * @param start Current start index of a match
 * @param end Current end index of a match
 * @param score The highest score so far (distance between start and end indexes)
 * @param caseSensitive Specify whether the fuzzy search is case sensitive or not (default: false)
 */
function traverseHaystack ({
  needle,
  haystack,
  needleIndex,
  haystackIndex,
  indexes = [],
  start = null,
  end = null,
  score = 0,
  caseSensitive,
}: TraverseHaystackParams) : PartialResult {
  const hlen = haystack.length
  const nlen = needle.length

  if (needleIndex >= nlen) {
    return {
      start,
      end,
      score,
      indexes
    }
  }

  while (haystackIndex < hlen) {
    if (compareCharacters(needle[needleIndex], haystack[haystackIndex], caseSensitive)) {
      if (start === null) {
        start = haystackIndex
      }
      end = ++haystackIndex
      return traverseHaystack({
        needle,
        haystack,
        needleIndex: needleIndex + 1,
        haystackIndex,
        indexes,
        start,
        end,
        score,
        caseSensitive
      })
    }

    if (start !== null) {
      score = end - start > score ? end - start : score
      indexes.push({ start, end })
      start = null
    }
    haystackIndex++
  }

  return {
    start: null,
    end,
    score: 0,
    indexes: []
  }
}

/**
 * Returns all the matches of the needle in the haystack. To do that, it first retrieves
 * the positions of all the occurrences of the needle's first character in the haystack
 * and then traverses the haystack looking for the needle, using each found position as
 * the starting index whithin the haystack.
 * @param needle The string to fuzzy-find in the haystack
 * @param haystack The input string
 * @param caseSensitive Specify whether the fuzzy search is case sensitive or not (default: false)
 */
function getAllMatches (needle: string, haystack: string, caseSensitive: boolean) : Result[] {
  const startIndexes = getStartIndexes(needle[0], haystack, caseSensitive)

  return startIndexes.map(startIndex => {
    let {
      start,
      end,
      indexes,
      score
    } = traverseHaystack({
      needle,
      haystack,
      needleIndex: 0,
      haystackIndex: startIndex,
      caseSensitive,
    })

    if (start !== null) {
      score = end - start > score ? end - start : score
      indexes.push({ start, end })
    }

    return {
      isMatch: indexes.length > 0,
      score,
      indexes
    }
  })
}

/**
 * Returns an object of type Result, where isMatch is true if needle matches haystack using a
 * fuzzy-search algorithm. In turn, indexes contains an array of type Index, which represents
 * the start and end indexes of the needle's characters matched in the haystack. The purpose of
 * this array is mostly to be used by the highlight method. Finally score is the length of the
 * longest slice of consecutively matching characters of needle inside haystack (i.e. the maximum
 * difference between its index pairs). The score is useful when matching a list of entries against
 * the same needle -which is most probably everyone's use case-, because you can use it to sort
 * the positive matches from best to worst score.
 * @param needle The string to fuzzy-find in the haystack
 * @param haystack The input string
 * @param options
 *   - caseSensitive: fuzzy search is case insensitive by default
 *   - tag: The string to wrap matched characters with (typically an HTML tag)
 */
export function fuzzySearch (needle: string, haystack: string, options?: Options) : Result {
  const { caseSensitive = false } = options || {}
  const hlen = haystack.length
  const nlen = needle.length

  if (nlen > hlen || nlen === 0) {
    return NO_MATCH
  }

  const isPerfectMatch = caseSensitive
    ? needle === haystack
    : needle.toLowerCase() === haystack.toLowerCase()

  if (nlen === hlen) {
    return {
      isMatch: isPerfectMatch,
      score: isPerfectMatch ? nlen : 0,
      indexes: isPerfectMatch ? [{ start: 0, end: nlen }] : []
    }
  }

  const allMatches = getAllMatches(needle, haystack, caseSensitive)

  if (!allMatches.length) {
    return NO_MATCH
  }

  const bestMatch = allMatches.reduce((bestSoFar, current) => {
    return current.score > bestSoFar.score ? current : bestSoFar
  }, allMatches[0])

  return bestMatch
}

/**
 * Returns true if needle matches haystack using a fuzzy-search algorithm.
 * The method will return true only if each character in the needle can be found
 * in the haystack and occurs after the preceding matches.
 * @param needle The string to fuzzy-find in the haystack
 * @param haystack The input string
 * @param options
 *   - caseSensitive: fuzzy search is case insensitive by default
 *   - tag: The string to wrap matched characters with (typically an HTML tag)
 */
export function isFuzzyMatch (needle: string, haystack: string|object, options?: Options) : boolean {
  if (typeof haystack === 'string') {
    const result = fuzzySearch(needle, haystack, options)
    return result.isMatch
  }

  return Object.keys(haystack).some(key => fuzzySearch(needle, haystack[key], options).isMatch)
}

/**
 * Returns haystack string with needle's matching characters wrapped in the given tag.
 * If tag is not specified, <strong> is used by default.
 * @param needle The string to fuzzy-find in the haystack
 * @param haystack The input string
 * @param
 * @param options
 *   - caseSensitive: Fuzzy search is case insensitive by default
*    - tag: The string to wrap matched characters with (typically an HTML tag)
 */
export function fuzzyHighlight (needle: string, haystack: string, options?: Options): string {
  const { tag = 'strong' } = options || {}
  const result = fuzzySearch(needle, haystack, options)
  return highlight(haystack, result.indexes, tag)
}

/**
 * Returns label with its characters in-between indexes wrapped in the given tag.
 * If tag is not specified, <strong> is used by default.
 * The indexes parameter should be of type Index[].
 * @param label The string to apply highlighting to
 * @param indexes The array of start-end indexes where to insert opening and closing tags
 * @param tag The string to wrap characters in-between `indexes` with (typically an HTML tag)
 */
export function highlight (label: string, indexes: Index[], tag: string = 'strong'): string {
  const ilen = indexes.length

  if (!ilen) {
    return label
  }

  const parts: string[] = []
  let start = 0

  for (let i = 0; i < ilen; i++) {
    parts.push(
      label.substring(start, indexes[i].start),
      `<${tag}>`,
      label.substring(indexes[i].start, indexes[i].end),
      `</${tag}>`
    )
    start = indexes[i].end
  }
  parts.push(label.substring(start))

  return parts.join('')
}
