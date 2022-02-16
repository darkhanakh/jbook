import { useEffect, useRef } from 'react'

interface PreviewProps {
  code: string
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<any>()

  useEffect(() => {
    iframeRef.current.srcdoc = iframeHtml
    iframeRef.current.contentWindow.postMessage(code, '*')
  }, [code])

  return (
    <iframe
      title="code preview"
      sandbox="allow-scripts"
      srcDoc={iframeHtml}
      ref={iframeRef}
    />
  )
}

export default Preview
