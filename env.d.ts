/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, Record<string, unknown>>
  export default component
}
declare module '*.json' {
  const value: unknown
  export default value
}
