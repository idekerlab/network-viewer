import React, { useMemo } from 'react'
import SelectionList from './SelectionList'

const GraphObjectPropertyPanel = ({ cx }) => {
  const rootStyle = {
    width: '100%',
    height: '100%',
  }

  const getLetterWidth = (sandbox, letter) => {
    sandbox.innerHTML = `<span>${letter}</span>`
    const el = sandbox.children[0]
    return el.offsetWidth
  }

  const letterWidths = useMemo(() => {
    const widths = {}
    let widthSum = 0
    const sandbox = document.getElementById('sandbox')
    for (let i = 32; i < 127; i++) {
      let letter = String.fromCharCode(i)
      if (letter === ' ') {
        letter = '&nbsp'
      }
      widths[letter] = getLetterWidth(sandbox, letter)
      widthSum += widths[letter]
    }
    widths['default'] = widthSum / (127 - 32)
    return widths
  }, [])

  return (
    <div style={rootStyle}>{cx === undefined ? <div /> : <SelectionList cx={cx} letterWidths={letterWidths} />}</div>
  )
}

export default GraphObjectPropertyPanel
