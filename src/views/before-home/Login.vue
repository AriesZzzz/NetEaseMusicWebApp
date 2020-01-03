<template>
  <div class="login">
    <van-nav-bar title="手机号登录" left-arrow @click-left="$router.back()" />

    <van-divider class="divider">未注册手机号登录后将自动创建账号</van-divider>

    <van-row type="flex" justify="center">
      <van-col span="22" class="van-hairline--bottom">
        <van-field
          type="tel"
          class="van-hairline--bottom"
          palaceholder="请输入手机号"
          readonly
          label="手机号+86"
          clearable
          :value="phone"
          @click.stop="show = true"
          @clear="clearField"
          ref="phone"
        />
      </van-col>
    </van-row>

    <van-row type="flex" justify="center" class="next-btn">
      <van-col span="22">
        <van-button color="#C20C0C" size="large" round :disabled="disabled" @click="nextStep">下一步</van-button>
      </van-col>
    </van-row>
    <van-number-keyboard v-model="phone" :show="show" :maxlength="11" @blur="show = false" />
  </div>
</template>

<script>
/*
    移动端点击输入框阻止默认键盘抬起，并且是输入框有焦点

*/
import { Toast } from 'vant'
import {
  verifyNewPhoneNum
} from 'api'
export default {
  data() {
    return {
      show: false,
      phone: '',
      disabled: true
    }
  },
  methods: {
    clearField() {
      this.phone = ''
    },
    async nextStep() {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(this.phone)) {
        Toast({
          message: '请输入正确\n手机号!',
          icon: 'warning-o'
        })
      } else {
        /*
        验证是否为未注册手机号
        是：注册  发送验证码 
              发送失败：提示错误信息
              发送成功：跳转到验证码页面 
        否：登录  跳转到输入密码页面
        */
        
        const result = await verifyNewPhoneNum(this.phone)
        if (result.data.exist === -1) {
          // 发送验证码
          this.$router.push({name: 'register'})
        } else {
          this.$router.push({name: 'password', query: { phone: this.phone }})
        }
      }

    }
  },
  watch: {
    phone(newValue) {
      if (newValue) {
        this.disabled = false
      } else {
        this.disabled = true
      }

    }
  },
}
</script>

<style lang="scss" scoped>
.divider {
  margin-top: 10vh;
}
.next-btn {
  margin-top: 10vh;
}
</style>