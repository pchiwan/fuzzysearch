import {
  fuzzyHighlight,
  fuzzySearch,
  highlight,
  isFuzzyMatch
} from '../src'

describe(`fuzzyhighlight's`, function () {
  const haystack = 'cartwheel'
  let expectedIndexes, result

  describe('isFuzzyMatch method', function () {
    it('should match expectations for given needle and haystack string', function () {
      expect(isFuzzyMatch('car', haystack)).toBeTruthy()
      expect(isFuzzyMatch('cwhl', haystack)).toBeTruthy()
      expect(isFuzzyMatch('cwheel', haystack)).toBeTruthy()
      expect(isFuzzyMatch('twl', haystack)).toBeTruthy()
      expect(isFuzzyMatch(haystack, haystack)).toBeTruthy()
      expect(isFuzzyMatch('CaR', haystack)).toBeTruthy()
      expect(isFuzzyMatch('cWhEel', haystack)).toBeTruthy()
      expect(isFuzzyMatch('TwL', haystack)).toBeTruthy()
      expect(isFuzzyMatch('car', 'CaRtwheeL')).toBeTruthy()
      expect(isFuzzyMatch('cwhl', 'CaRtwheeL')).toBeTruthy()
      expect(isFuzzyMatch('cwheel', 'CaRtwheeL')).toBeTruthy()
      expect(isFuzzyMatch('twl', 'CaRtwheeL')).toBeTruthy()
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

    it('should match expectations for given needle and haystack object', function () {
      expect(isFuzzyMatch('car', { foo: haystack, bar: 'bar' })).toBeTruthy()
      expect(isFuzzyMatch('cwhl', { foo: 'foo', bar: haystack })).toBeTruthy()
      expect(isFuzzyMatch('cwheel', { foo: haystack, bar: haystack })).toBeTruthy()
      expect(isFuzzyMatch('twl', { foo: haystack, bar: 'bar' })).toBeTruthy()
      expect(isFuzzyMatch('CWhl', { foo: 'foo', bar: haystack })).toBeTruthy()
      expect(isFuzzyMatch('cWheEl', { foo: haystack, bar: haystack })).toBeTruthy()
      expect(isFuzzyMatch('car', {})).toBeFalsy()
      expect(isFuzzyMatch('car', { foo: 'foo', bar: 'bar' })).toBeFalsy()
      expect(isFuzzyMatch('cwheeel', { foo: haystack, bar: 'bar' })).toBeFalsy()
      expect(isFuzzyMatch('lw', { foo: haystack, bar: 'bar' })).toBeFalsy()
    })

    describe('case sensitive', () => {
      it('should match expectations for given needle and haystack string', function () {
        expect(isFuzzyMatch('car', haystack, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('cwhl', haystack, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('cwheel', haystack, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('twl', haystack, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch(haystack.toUpperCase(), haystack, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('CaR', haystack, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('cWhEel', haystack, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('TwL', haystack, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('car', 'CaRtwheeL', { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('cwhl', 'CaRtwheeL', { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('cwheel', 'CaRtwheeL', { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('twl', 'CaRtwheeL', { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('cwheeel', haystack, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('lw', haystack, { caseSensitive: true })).toBeFalsy()
      })

      it('should match expectations for given needle and haystack object', function () {
        expect(isFuzzyMatch('car', { foo: haystack, bar: 'bar' }, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('cwhl', { foo: 'foo', bar: haystack }, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('cwheel', { foo: haystack, bar: haystack }, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('twl', { foo: haystack, bar: 'bar' }, { caseSensitive: true })).toBeTruthy()
        expect(isFuzzyMatch('CWhl', { foo: 'foo', bar: haystack }, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('cWheEl', { foo: haystack, bar: haystack }, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('car', {}, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('car', { foo: 'foo', bar: 'bar' }, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('cwheeel', { foo: haystack, bar: 'bar' }, { caseSensitive: true })).toBeFalsy()
        expect(isFuzzyMatch('lw', { foo: haystack, bar: 'bar' }, { caseSensitive: true })).toBeFalsy()
      })
    })
  })

  describe('fuzzySearch method', function () {
    it('should return a match result', function () {
      expectedIndexes = [{ start: 0, end: 3 }]
      result = fuzzySearch('car', haystack)
      expect(result.isMatch).toBeTruthy()
      expect(result.indexes).toEqual(expectedIndexes)
      expect(result.score).toEqual(3)

      expectedIndexes = [{ start: 0, end: 3 }]
      result = fuzzySearch('CaR', haystack)
      expect(result.isMatch).toBeTruthy()
      expect(result.indexes).toEqual(expectedIndexes)
      expect(result.score).toEqual(3)

      expectedIndexes = [{ start: 3, end: 5 }, { start: 8, end: 9 }]
      result = fuzzySearch('twl', haystack)
      expect(result.isMatch).toBeTruthy()
      expect(result.indexes).toEqual(expectedIndexes)
      expect(result.score).toEqual(2)

      result = fuzzySearch('lw', haystack)
      expect(result.isMatch).toBeFalsy()
      expect(result.indexes).toEqual([])
    })

    describe('case sensitive', () => {
      it('should return a match result', function () {
        expectedIndexes = [{ start: 0, end: 3 }]
        result = fuzzySearch('car', haystack, { caseSensitive: true })
        expect(result.isMatch).toBeTruthy()
        expect(result.indexes).toEqual(expectedIndexes)
        expect(result.score).toEqual(3)

        result = fuzzySearch('CaR', haystack, { caseSensitive: true })
        expect(result.isMatch).toBeFalsy()
        expect(result.indexes).toEqual([])
      })
    })

    describe('when there are several matches with different scores', function () {
      it('should return the match result with the highest score', function () {
        expectedIndexes = [{ start: 33, end: 36 }]
        result = fuzzySearch('lao', 'republica democratica popular de lao')
        expect(result.isMatch).toBeTruthy()
        expect(result.indexes).toEqual(expectedIndexes)
        expect(result.score).toEqual(3)
      })
    })

    describe('when there are several matches with equal score', function () {
      it('should return the earliest match result', function () {
        expectedIndexes = [{ start: 0, end: 3 }]
        result = fuzzySearch('hob', 'hobohobbohobbit')
        expect(result.indexes).toEqual(expectedIndexes)
        expect(result.score).toEqual(3)

        expectedIndexes = [{ start: 4, end: 8 }]
        result = fuzzySearch('hobb', 'hobohobbohobbit')
        expect(result.indexes).toEqual(expectedIndexes)
        expect(result.score).toEqual(4)

        expectedIndexes = [{ start: 9, end: 14 }]
        result = fuzzySearch('hobbi', 'hobohobbohobbit')
        expect(result.indexes).toEqual(expectedIndexes)
        expect(result.score).toEqual(5)
      })
    })
  })

  describe('highlight method', function () {
    const indexes1 = [{ start: 0, end: 3 }]
    const indexes2 = [{ start: 3, end: 5 }, { start: 8, end: 9 }]

    it(`should wrap given label's characters in-between indexes with default HTML tag`, function () {
      const expected1 = `<strong>car</strong>twheel`
      expect(highlight(haystack, indexes1)).toEqual(expected1)

      const expected2 = `car<strong>tw</strong>hee<strong>l</strong>`
      expect(highlight(haystack, indexes2)).toEqual(expected2)
    })

    it(`should wrap given label's characters in-between indexes with specified HTML tag`, function () {
      const expected1 = `<b>car</b>twheel`
      expect(highlight(haystack, indexes1, 'b')).toEqual(expected1)

      const expected2 = `car<foo>tw</foo>hee<foo>l</foo>`
      expect(highlight(haystack, indexes2, 'foo')).toEqual(expected2)
    })
  })

  describe('fuzzyHighlight method', function () {
    it('should combine fuzzy search and match highlighting', function () {
      const expected1 = `<strong>car</strong>twheel`
      expect(fuzzyHighlight('car', haystack)).toEqual(expected1)

      const expected2 = `<strong>car</strong>twheel`
      expect(fuzzyHighlight('CaR', haystack)).toEqual(expected2)

      const expected3 = `car<foo>tw</foo>hee<foo>l</foo>`
      expect(fuzzyHighlight('twl', haystack, { tag: 'foo' })).toEqual(expected3)

      const expected4 = `cartwheel`
      expect(fuzzyHighlight('CaR', haystack, { caseSensitive: true })).toEqual(expected4)
    })
  })
})
