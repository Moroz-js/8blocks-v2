/**
 * Patch @next/env so Payload's loadEnv.js doesn't crash.
 * Strategy: intercept Module._load so every require('@next/env') returns
 * an object that has .default pointing to itself.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const Module = require('module')

// Patch the cached exports AND intercept future loads
const nextEnv = require('@next/env')
if (!nextEnv.default) nextEnv.default = nextEnv

// Belt-and-suspenders: also intercept _load so even if the cache is bypassed
// we always return an object with .default set
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
