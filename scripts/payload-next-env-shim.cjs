/**
 * Patch @next/env so Payload's loadEnv.js doesn't crash when default export is missing.
 * Intercept Module._load so require('@next/env') always exposes .default === module exports.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const Module = require('module')

const nextEnv = require('@next/env')
if (!nextEnv.default) nextEnv.default = nextEnv

const origLoad = Module._load.bind(Module)
Module._load = function (request, parent, isMain) {
  const result = origLoad(request, parent, isMain)
  if (
    typeof request === 'string' &&
    (request === '@next/env' || request.endsWith('@next/env'))
  ) {
    if (result && !result.default) result.default = result
  }
  return result
}
