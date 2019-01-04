import { search, highlight } from '../src'

describe(`fuzzyhighlight's`, () => {
  describe('search method', () => {
    test('should match expectations', () => {
      expect(search('car', 'cartwheel').result).toBeTruthy()
      expect(search('cwhl', 'cartwheel').result).toBeTruthy()
      expect(search('cwheel', 'cartwheel').result).toBeTruthy()
      expect(search('twl', 'cartwheel').result).toBeTruthy()
      expect(search('cartwheel', 'cartwheel').result).toBeTruthy()
      expect(search('cwheeel', 'cartwheel').result).toBeFalsy()
      expect(search('lw', 'cartwheel').result).toBeFalsy()

      // chinese unicode testcase
      expect(search('语言', 'php语言').result).toBeTruthy()
      expect(search('hp语', 'php语言').result).toBeTruthy()
      expect(search('Py开发', 'Python开发者').result).toBeTruthy()
      expect(search('Py 开发', 'Python开发者').result).toBeFalsy()
      expect(search('爪哇进阶', '爪哇开发进阶').result).toBeTruthy()
      expect(search('格式工具', '非常简单的格式化工具').result).toBeTruthy()
      expect(search('正则', '学习正则表达式怎么学习').result).toBeTruthy()
      expect(search('学习正则', '正则表达式怎么学习').result).toBeFalsy()
      // end chinese unicode testcase
    })
  })

  describe('highlight method', () => {
    const haystack = 'cartwheel'
    const output1 = search('car', haystack)
    const output2 = search('twl', haystack)

    test('should highlight matches with default HTML tag', () => {
      const expected1 = `<strong>car</strong>twheel`
      expect(highlight(haystack, output1.indexes)).toEqual(expected1)

      const expected2 = `car<strong>tw</strong>hee<strong>l</strong>`
      expect(highlight(haystack, output2.indexes)).toEqual(expected2)
    })

    test('should highlight matches with specified HTML tag', () => {
      const expected1 = `<b>car</b>twheel`
      expect(highlight(haystack, output1.indexes, 'b')).toEqual(expected1)

      const expected2 = `car<foo>tw</foo>hee<foo>l</foo>`
      expect(highlight(haystack, output2.indexes, 'foo')).toEqual(expected2)
    })
  })
})
