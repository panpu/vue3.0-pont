import { defineComponent, onMounted, PropType, reactive, ref, UnwrapRef } from '@vue/composition-api'
import _ from 'lodash'
import { IFormItem } from './interface'
import { Col, Form } from 'element-ui'
import './style.scss'
import * as uitls from '@/utils/validate'

const IForm = defineComponent({
  name: 'i-form',
  inheritAttrs: false,
  props: {
    getRef: Function as PropType<(form: Form) => Form>,
    state: Object as PropType<UnwrapRef<any>>,
    formItems: Array as PropType<IFormItem[]>,
    col: Object as PropType<Col>,
    footer: Object as PropType<null>,
    ok: Function as PropType<() => Promise<any>>,
    renderFooter: Function
  },
  setup(props, { attrs, emit, slots }) {
    const state = reactive({ loading: false })
    const formRef = ref<Form | null>(null)

    onMounted(() => {
      const form = formRef.value! as Form
      props.getRef?.(form)
    })

    const submit = async () => {
      const res = await formRef.value?.validate().catch(() => {})
      if (res) {
        state.loading = true
        props.ok?.()?.finally(() => (state.loading = false))
      }
    }

    const generateRules = ({ required, validator, type, ...attrs }: IFormItem) => {
      const rules = attrs.rules || []
      const fn = (validate, msg: string) => ({
        validator: (_, val, cb) => {
          val ? (!validate(val) ? cb(msg) : cb()) : cb()
        }
      })

      if (required) {
        rules.push({
          required: required,
          message: attrs.label + '是必填项'
        })
      }

      if (validator) {
        rules.push({ validator: (_, val, cb) => validator?.(val, cb) })
      }

      switch (type) {
        case 'email':
          rules.push(fn(uitls.isEmail, '请输入正确的邮箱地址'))
          break
        case 'tel':
          rules.push(fn(uitls.isTel, '请输入正确的电话号码'))
        case 'phone':
          rules.push(fn(uitls.isPhone, '请输入正确的电话号码'))

        default:
          break
      }

      rules.forEach(rule => (rule.trigger = rule.trigger || 'blur'))
      attrs.rules = rules

      return attrs
    }

    const renderItem = () => {
      // const defaultCol = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
      const defaultCol = { span: 8 }
      return props.formItems?.map(({ render, prop, col, style, title, show, ...attrs }) => {
        const colProps = col || props.col || defaultCol
        const itemProps = { ...generateRules(attrs), prop }
        const node = title ? (
          <el-col span={24}>
            <span class='title'>{title}</span>
          </el-col>
        ) : (
          <el-col key={prop} style={style} props={colProps}>
            <el-form-item props={itemProps}>{render?.()}</el-form-item>
          </el-col>
        )
        return show !== false || title ? node : null
      })
    }

    const renderFooter = () => {
      if (props.footer !== null) {
        const defaultFooter = [
          <el-button onClick={() => emit('cancel')}>取消</el-button>,
          <el-button loading={state.loading} type='primary' onClick={submit}>
            保存
          </el-button>
        ]
        return (
          <el-col class='footer' span={24}>
            {props.renderFooter?.(defaultFooter) || [slots.footer?.(), defaultFooter]}
          </el-col>
        )
      }
    }

    return () => (
      <el-row class='i-form' gutter={40}>
        <el-form
          ref={formRef}
          props={{
            ...attrs,
            'status-icon': true,
            labelPosition: 'top',
            model: props.state
          }}
        >
          {renderItem()}
          <el-col span={24}>{slots.default?.()}</el-col>
        </el-form>
        {renderFooter()}
      </el-row>
    )
  }
})

export default IForm
