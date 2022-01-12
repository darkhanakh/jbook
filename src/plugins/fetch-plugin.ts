import * as esbuild from 'esbuild-wasm'
import localforage from 'localforage'
import axios from 'axios'

const fileCache = localforage.createInstance({
  name: 'appcache',
})

const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: input,
        }
      })

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        if (cachedResult) {
          return cachedResult
        }

        const { data, request } = await axios.get(args.path)

        const escaped: string = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `

        const result: esbuild.OnLoadResult = {
          contents,
          loader: 'jsx',
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await fileCache.setItem(args.path, result)

        return result
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        if (cachedResult) {
          return cachedResult
        }

        const { data, request } = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          contents: data,
          loader: 'jsx',
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await fileCache.setItem(args.path, result)

        return result
      })
    },
  }
}

export default fetchPlugin
