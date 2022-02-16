import 'bulmaswatch/superhero/bulmaswatch.min.css'
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin, fetchPlugin } from './plugins'
import { CodeEditor, Preview } from './components'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const serviceRef = useRef<esbuild.Service>()

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  const onClickHandler = async () => {
    if (!serviceRef.current) {
      return
    }

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })

    setCode(result.outputFiles[0].text)
  }

  useEffect(() => {
    startService()
  }, [])

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
