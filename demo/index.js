import './styles.css'
import { search, highlight } from '../lib/index'

const printableIndexes = indexes => {
  const values = indexes.map(({ start, end }) => `[${start}-${end}]`)
  return values.join()
}

document.getElementById('needle').addEventListener('input', event => {
  const needle = event.target.value
  const haystack = document.getElementById('haystack').value
  findMatches(needle, haystack)
})

document.getElementById('haystack').addEventListener('input', event => {
  const haystack = event.target.value
  const needle = document.getElementById('needle').value
  findMatches(needle, haystack)
})

const findMatches = (needle, haystack) => {
  console.log(`finding matches for ${needle} in ${haystack}`)
  const fuzzyResult = search(needle, haystack)

  if (fuzzyResult.result) {
    console.log(
      `${needle}, ${haystack} => ${printableIndexes(fuzzyResult.indexes)}`
    )

    const highlightedLabel = highlight(haystack, fuzzyResult.indexes)
    document.getElementById('result').style.color = 'black'
    document.getElementById('result').innerHTML = highlightedLabel
  } else {
    document.getElementById('result').style.color = 'red'
    document.getElementById('result').innerHTML = 'No match'
  }
}
