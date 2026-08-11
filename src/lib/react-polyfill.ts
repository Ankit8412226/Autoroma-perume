import React from 'react'

/**
 * Polyfill React Shared Internals for React 19 / Next.js 15 compatibility.
 * Libraries like react-reconciler (used by @react-three/fiber) expect
 * React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED with properties:
 * - ReactCurrentDispatcher
 * - ReactCurrentOwner
 * - ReactCurrentBatchConfig
 * - ReactCurrentActQueue
 */
if (typeof window !== 'undefined' || true) {
  const ReactAny = React as Record<string, any>
  const SECRET_KEY = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
  const CLIENT_KEY = '__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE'

  if (!ReactAny[SECRET_KEY]) {
    const clientInternals = ReactAny[CLIENT_KEY] || {}

    const dummyBatchConfig = { transition: null }
    const dummyActQueue = { current: null, isBatchingLegacy: false, didScheduleLegacyUpdate: false }
    const dummyDispatcher = { current: null }
    const dummyOwner = { current: null }

    const proxyTarget = clientInternals

    ReactAny[SECRET_KEY] = new Proxy(proxyTarget, {
      get(target, prop: string) {
        if (prop === 'ReactCurrentDispatcher') {
          return target.ReactCurrentDispatcher || target.H || dummyDispatcher
        }
        if (prop === 'ReactCurrentOwner') {
          return target.ReactCurrentOwner || target.A || dummyOwner
        }
        if (prop === 'ReactCurrentBatchConfig') {
          return target.ReactCurrentBatchConfig || target.T || dummyBatchConfig
        }
        if (prop === 'ReactCurrentActQueue') {
          return target.ReactCurrentActQueue || target.actQueue || dummyActQueue
        }
        return target[prop]
      },
      set(target, prop: string, value: any) {
        if (prop === 'ReactCurrentDispatcher') target.H = value
        if (prop === 'ReactCurrentOwner') target.A = value
        if (prop === 'ReactCurrentBatchConfig') target.T = value
        if (prop === 'ReactCurrentActQueue') target.actQueue = value
        target[prop] = value
        return true
      },
    })
  }
}

export {}
