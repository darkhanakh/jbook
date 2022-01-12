import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const serviceRef = useRef<esbuild.Service>();

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: './esbuild.wasm',
    });
  };

  const onClickHandler = async () => {
    if (!serviceRef.current) {
      return;
    }

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  useEffect(() => {
    startService();
  }, []);

  return (
    <div>
      <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.querySelector('#root'),
);
