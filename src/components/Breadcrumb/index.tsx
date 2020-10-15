import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'i-breadcrumb',
  data() {
    return {
      breadData: [] as any[]
    }
  },
  mounted() {
    this.breadData = this.$route.matched
  },
  watch: {
    $route(to) {
      this.breadData = to.matched
    }
  },
  render() {
    return (
      <el-breadcrumb class='brm' separator='/'>
        {this.breadData.map(item => {
          return <el-breadcrumb-item key={item.path}>{item.meta.title}</el-breadcrumb-item>
        })}
      </el-breadcrumb>
    )
  }
})
