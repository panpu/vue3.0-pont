<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    this.getBodyClient()
    // 监听window的resize事件．在浏览器窗口变化时再设置下页面显示区域的高度．1111
    window.onresize = () => {
      this.getBodyClient()
    }
  },
  methods: {
    getBodyClient() {
      const clientHeight = document.getElementById('app').clientHeight
      const clientWidth = document.getElementById('app').clientWidth
      this.$store.commit('SET_ClIENT_SIZE', {
        clientHeight: clientHeight - 60,
        clientWidth: clientWidth
      })
    }
  }
}
</script>

<style></style>
