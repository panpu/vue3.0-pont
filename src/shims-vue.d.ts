declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '*.svg?inline' {
  import Vue from 'vue'
  export default Vue
}
declare module '*.png' {
  import Vue from 'vue'
  export default Vue
}
