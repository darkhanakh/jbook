import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';

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

  const onClickHandler = () => {
    if (!serviceRef.current) {
      return;
    }

    const transformedCode = serviceRef.current.transform(input, {
      loader: 'tsx',
      target: 'es2015',
    });

    transformedCode.then(c => setCode(c.code));
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
