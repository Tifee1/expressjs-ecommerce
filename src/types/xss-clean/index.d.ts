declare module 'xss-clean' {
  import express from 'express'

  function xssClean(options?: {
    whitelist?: string | string[]
    sanitize?: (key: string, value: any) => any
    replace?: (key: string, value: any) => any
  }): express.RequestHandler

  export = xssClean
}
