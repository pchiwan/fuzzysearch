import {
  fuzzyHighlight,
  highlight,
  isFuzzyMatch,
  search
} from '../src'

describe(`fuzzyhighlight's`, function () {
  const haystack = 'cartwheel'

  describe('isFuzzyMatch method', function () {
    test('should match expectations for given needle and haystack string', function () {
      expect(isFuzzyMatch('car', haystack)).toBeTruthy()
      expect(isFuzzyMatch('cwhl', haystack)).toBeTruthy()
      expect(isFuzzyMatch('cwheel', haystack)).toBeTruthy()
      expect(isFuzzyMatch('twl', haystack)).toBeTruthy()
      expect(isFuzzyMatch(haystack, haystack)).toBeTruthy()
      expect(isFuzzyMatch('cwheeel', haystack)).toBeFalsy()
      expect(isFuzzyMatch('lw', haystack)).toBeFalsy()

      // chinese unicode testcase
      expect(isFuzzyMatch('语言', 'php语言')).toBeTruthy()
      expect(isFuzzyMatch('hp语', 'php语言')).toBeTruthy()
      expect(isFuzzyMatch('Py开发', 'Python开发者')).toBeTruthy()
      expect(isFuzzyMatch('Py 开发', 'Python开发者')).toBeFalsy()
      expect(isFuzzyMatch('爪哇进阶', '爪哇开发进阶')).toBeTruthy()
      expect(isFuzzyMatch('格式工具', '非常简单的格式化工具')).toBeTruthy()
      expect(isFuzzyMatch('正则', '学习正则表达式怎么学习')).toBeTruthy()
      expect(isFuzzyMatch('学习正则', '正则表达式怎么学习')).toBeFalsy()
    })

    test('should match expectations for given needle and haystack object', function () {
      expect(isFuzzyMatch('car', { foo: haystack, bar: 'bar' })).toBeTruthy()
      expect(isFuzzyMatch('cwhl', { foo: 'foo', bar: haystack })).toBeTruthy()
      expect(isFuzzyMatch('cwheel', { foo: haystack, bar: haystack })).toBeTruthy()
      expect(isFuzzyMatch('twl', { foo: haystack, bar: 'bar' })).toBeTruthy()
      expect(isFuzzyMatch('car', {})).toBeFalsy()
      expect(isFuzzyMatch('car', { foo: 'foo', bar: 'bar' })).toBeFalsy()
      expect(isFuzzyMatch('cwheeel', { foo: haystack, bar: 'bar' })).toBeFalsy()
      expect(isFuzzyMatch('lw', { foo: haystack, bar: 'bar' })).toBeFalsy()
    })
  })

  describe('search method', function () {
    test('should return match result and indexes for given needle and haystack', function () {
      const expectedIndexes1 = [{ start: 0, end: 3 }]
      expect(search('car', haystack).result).toBeTruthy()
      expect(search('car', haystack).indexes).toEqual(expectedIndexes1)

      const expectedIndexes2 = [{ start: 3, end: 5 }, { start: 8, end: 9 }]
      expect(search('twl', haystack).result).toBeTruthy()
      expect(search('twl', haystack).indexes).toEqual(expectedIndexes2)

      expect(search('lw', haystack).result).toBeFalsy()
      expect(search('lw', haystack).indexes).toEqual([])
    })
  })

  describe('highlight method', function () {
    const indexes1 = [{ start: 0, end: 3 }]
    const indexes2 = [{ start: 3, end: 5 }, { start: 8, end: 9 }]

    test(`should wrap given label's characters in-between indexes with default HTML tag`, function () {
      const expected1 = `<strong>car</strong>twheel`
      expect(highlight(haystack, indexes1)).toEqual(expected1)

      const expected2 = `car<strong>tw</strong>hee<strong>l</strong>`
      expect(highlight(haystack, indexes2)).toEqual(expected2)
    })

    test(`should wrap given label's characters in-between indexes with specified HTML tag`, function () {
      const expected1 = `<b>car</b>twheel`
      expect(highlight(haystack, indexes1, 'b')).toEqual(expected1)

      const expected2 = `car<foo>tw</foo>hee<foo>l</foo>`
      expect(highlight(haystack, indexes2, 'foo')).toEqual(expected2)
    })
  })

  describe('fuzzyHighlight method', function () {
    test('should combine fuzzy search and match highlighting', function () {
      const expected1 = `<strong>car</strong>twheel`
      expect(fuzzyHighlight('car', haystack)).toEqual(expected1)

      const expected2 = `car<foo>tw</foo>hee<foo>l</foo>`
      expect(fuzzyHighlight('twl', haystack, 'foo')).toEqual(expected2)
    })
  })
})
