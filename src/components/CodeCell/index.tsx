import { useState } from 'react'
import { CodeEditor, Preview } from './../../components'
import bundle from './../../bundler'

const CodeCell = () => {
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

export default CodeCell
