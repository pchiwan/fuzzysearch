import './styles.css'
import { search, highlight } from '../lib/index'

document.getElementById('needle').addEventListener('input', event => {
  const needle = event.target.value
  const haystack = document.getElementById('haystack').value
  findMatches(needle, haystack.split('\n'))
})

document.getElementById('haystack').addEventListener('input', event => {
  const haystack = event.target.value
  const needle = document.getElementById('needle').value
  findMatches(needle, haystack.split('\n'))
})

const findMatches = (needle, haystack) => {
  const fuzzyResults = haystack
    .map(entry => ({ label: entry, ...search(needle, entry) }))
    .filter(result => !!result.indexes.length)

  if (fuzzyResults.length) {
    document.getElementById('result').style.color = 'black'
    document.getElementById('result').innerHTML = ''

    fuzzyResults.sort((a, b) => b.score - a.score)
    fuzzyResults.forEach(result => {
      if (!result.label) {
        return
      }

      const highlightedLabel = highlight(result.label, result.indexes)
      document.getElementById('result').innerHTML += `<li>${highlightedLabel}</li>`
    })
  } else {
    document.getElementById('result').style.color = 'red'
    document.getElementById('result').innerHTML = 'No matches'
  }
}
