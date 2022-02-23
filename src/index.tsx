import 'bulmaswatch/superhero/bulmaswatch.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { CodeCell } from './components'

const App = () => {
  return (
    <div>
      <CodeCell />
      <CodeCell />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.querySelector('#root')
)
