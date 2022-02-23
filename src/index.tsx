import 'bulmaswatch/superhero/bulmaswatch.min.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { CodeEditor, Preview } from './components'
import bundle from './bundler'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const onClickHandler = async () => {
    const output = await bundle(input)

    setCode(output)
  }

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1"
        onChange={value => setInput(value)}
      />
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.querySelector('#root')
)
