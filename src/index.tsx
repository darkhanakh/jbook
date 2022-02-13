import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin, fetchPlugin } from './plugins'
import { CodeEditor } from './components'

const App = () => {
  const [input, setInput] = useState('')

  const serviceRef = useRef<esbuild.Service>()
  const iframeRef = useRef<any>()

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

    iframeRef.current.srcdoc = iframeHtml

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

    // setCode(result.outputFiles[0].text)
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  useEffect(() => {
    startService()
  }, [])

  const iframeHtml = `
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', e => {
            try {
              eval(e.data)
            } catch(error) {
              const root = document.querySelector('#root')
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>'
              throw error
            }
          }, false);
        </script>
      </body>
    </html>
  `

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1"
        onChange={value => setInput(value)}
      />
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>
      <iframe
        title="code preview"
        sandbox="allow-scripts"
        srcDoc={iframeHtml}
        ref={iframeRef}
      />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.querySelector('#root')
)
