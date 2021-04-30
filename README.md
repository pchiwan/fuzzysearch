fuzzyhighlight
==============

## **FORKED FROM / BASED ON [`fuzzysearch`](https://github.com/bevacqua/fuzzysearch) by [Nicolas Bevacqua](https://ponyfoo.com)**

> Tiny, fast, and dependency-less fuzzy search + highlighting in JavaScript

Fuzzy searching allows for flexibly matching a string with partial input, useful for filtering data very quickly based on lightweight user input.

## Demo

Head [here](https://silvia.murblan.ch/fuzzyhighlight/) for a simple working demo.

## Install

```shell
npm install --save fuzzyhighlight
```

or

```shell
yarn add fuzzyhighlight
```

## Usage

You may import `fuzzyhighlight` as a whole, or its methods separately.

```javascript
import * as fuzzyhighlight from 'fuzzyhighlight'
import {
  fuzzyHighlight,
  fuzzySearch,
  highlight,
  isFuzzyMatch
} from 'fuzzyhighlight'
```

## Interfaces

```javascript
interface Index {
  start: number,
  end: number
}

interface Result {
  isMatch: boolean,
  indexes: Index[],
  score: number
}

interface Options {
  caseSensitive?: boolean,
  tag?: string
}
```

### `isFuzzyMatch`

> `isFuzzyMatch(needle: string, haystack: string|object, options?: Options) : boolean`

Returns `true` if `needle` matches `haystack` using a fuzzy-search algorithm. The method will return `true` only if each character in the `needle` can be found in the `haystack` and occurs after the preceding matches.

If the provided `haystack` is an object instead of a string, the method will return `true` if any of the object's values fuzzy-matches the `needle`.

Note that this program doesn't implement _[levenshtein distance][1]_, but rather a simplified version where **there's no approximation**.

#### Options
##### caseSensitive
Fuzzy-search is case insentitive by default, you can make it otherwise by providing `options` with `{ caseSensitive: true }`.

#### Examples
```javascript
isFuzzyMatch('twl', 'cartwheel') // true
isFuzzyMatch('art', 'cartwheel') // true
isFuzzyMatch('CaRt', 'cartwheel') // true
isFuzzyMatch('cw', 'cartwheel') // true
isFuzzyMatch('eE', 'cartwheel') // true
isFuzzyMatch('eeel', 'cartwheel') // false
isFuzzyMatch('dog', 'cartwheel') // false
isFuzzyMatch('CaRt', 'cartwheel', { caseSensitive: true }) // false
isFuzzyMatch('eE', 'cartwheel', { caseSensitive: true }) // false

isFuzzyMatch('car', { foo: 'cartwheel', bar: 'bar' }) // true
isFuzzyMatch('cwhl', { foo: 'foo', bar: 'cartwheel' }) // true
isFuzzyMatch('cWheEl', { foo: 'cartwheel', bar: 'cartwheel' }) // true
isFuzzyMatch('car', {}) // false
isFuzzyMatch('car', { foo: 'foo', bar: 'bar' }) // false
isFuzzyMatch('CarT', { foo: 'foo', bar: 'cartwheel' }, { caseSensitive: true }) // true
```

### `fuzzyHighlight`

> `fuzzyHighlight(needle: string, haystack: string, options?: Options) : string`

Returns `haystack` string with `needle`'s matching characters wrapped in a `<strong>` tag by default.

#### Options
##### caseSensitive
Fuzzy-search is case insentitive by default, you can make it otherwise by providing `options` with `{ caseSensitive: true }`.

##### tag
You can specify the `tag` you want to wrap the `needle`'s matching characters with; otherwise, `<strong>` is used by default. Mind that it doesn't have to be a valid HTML tag.

#### Examples

```javascript
fuzzyHighlight('car', 'cartwheel') // <strong>car</strong>twheel
fuzzyHighlight('twl', 'cartwheel') // car<strong>tw</strong>hee<strong>l</strong>
fuzzyHighlight('CaRe', 'cartwheel') // <strong>car</strong>wh<strong>e</strong>el
fuzzyHighlight('CaRe', 'cartwheel', { caseSensitive: true }) // cartwheel
fuzzyHighlight('cw', 'cartwheel', { tag: 'em' }) // <em>c</em>art<em>w</em>heel
fuzzyHighlight('ee', 'cartwheel', { tag: 'i' }) // cartwh<i>ee</i>l
fuzzyHighlight('wheel', 'cartwheel', { tag: 'foo' }) // cartwh<foo>ee</foo>l
```

### `fuzzySearch`

> `fuzzySearch(needle: string, haystack: string, options?: Options) : Result`

Returns an object of type `Result`, where `isMatch` is `true` if `needle` matches `haystack` using a fuzzy-search algorithm.

In turn, `indexes` contains an array of type `Index`, which represents the `start` and `end` indexes of the `needle`'s characters matched in the `haystack`. The purpose of this array is mostly to be used by the [`highlight`](#highlight) method.

Finally `score` is the length of the longest slice of consecutively matching characters of `needle` inside `haystack` (i.e. the maximum difference between its index pairs). The score is useful when matching a list of entries against the same `needle` -which is most probably everyone's use case-, because you can use it to sort the positive matches from best to worst score.

<sub>NOTE: The [working demo](https://silvia.murblan.ch/fuzzyhighlight/) implements this sorting behavior if you want to try it out.</sub>

#### Options
##### caseSensitive
Fuzzy-search is case insentitive by default, you can make it otherwise by providing `options` with `{ caseSensitive: true }`.

#### Examples

```javascript
fuzzySearch('twl', 'cartwheel')
// {
//   isMatch: true,
//   indexes: [{ start: 3, end: 5}, { start: 8, end: 9 }],
//   score: 2
// }
fuzzySearch('art', 'cartwheel')
// {
//   isMatch: true,
//   indexes: [{ start: 1, end: 4}],
//   score: 3
// }
fuzzySearch('cw', 'cartwheel')
// {
//   isMatch: true,
//   indexes: [{ start: 0, end: 1}, { start: 4, end: 5 }]
//   score: 1
// }
fuzzySearch('ee', 'cartwheel')
// {
//   isMatch: true,
//   indexes: [{ start: 6, end: 8}]
//   score: 2
// }
fuzzySearch('eeel', 'cartwheel')
// {
//   isMatch: false,
//   indexes: []
//   score: 0
// }
fuzzySearch('CaRt', 'cartwheel', { caseSensitive: true })
// {
//   isMatch: false,
//   indexes: []
//   score: 0
// }
fuzzySearch('dog', 'cartwheel')
// {
//   isMatch: false,
//   indexes: [],
//   score: 0
// }
```

### `highlight`

> `highlight(label: string, indexes: Index[], tag: string = 'strong')`

Returns `label` with its characters in-between `indexes` wrapped in the given `tag`. If `tag` is not specified, `<strong>` is used by default.

The `indexes` parameter should be of type `Index[]`.

#### Examples

```javascript
highlight('cartwheel', [{ start: 0, end: 3 }]) // <strong>car</strong>twheel
highlight('cartwheel', [{ start: 1, end: 4}]) // car<strong>tw</strong>hee<strong>l</strong>
highlight('cartwheel', [{ start: 0, end: 1}, { start: 4, end: 5 }], 'b') // <b>c</b>art<b>w</b>heel
highlight('cartwheel', [{ start: 6, end: 8}], 'i') // cartwh<i>ee</i>l
```

<sub>The current implementation uses the algorithm suggested by Mr. Aleph, a crazy russian compiler engineer working at V8.</sub>

## License

MIT

[1]: http://en.wikipedia.org/wiki/Levenshtein_distance
