<template>
    <common-layout>
        <div class="top mb-5 mt-5">
            <div class="header">
                <span class="title">HỆ THỐNG QUẢN LÝ JAVIS Smart</span>
            </div>
            <img
                alt="logo"
                src="@/assets/img/logo.png"
                width="100"
                class="mt-3"
                style="border-radius: 15%"
            />
        </div>
        <div class="login">
            <a-form @submit="onSubmit" :form="form">
                <a-form-item class="mb-4">
                    <a-input
                        size="large"
                        placeholder="Email"
                        v-decorator="[
                            'email',
                            {
                                rules: emailRules
                            }
                        ]"
                    >
                        <a-icon slot="prefix" style="margin-top: 2px" type="user" />
                    </a-input>
                </a-form-item>
                <a-form-item class="mb-4">
                    <a-input-password
                        size="large"
                        placeholder="Mật khẩu"
                        v-decorator="[
                            'password',
                            {
                                rules: passwordRules
                            }
                        ]"
                    >
                        <a-icon slot="prefix" style="margin-top: 2px" type="lock" />
                    </a-input-password>
                </a-form-item>
                <a-form-item class="mb-4">
                    <a-row>
                        <a-col :span="13">
                            <a-input
                                size="large"
                                placeholder="Mã xác nhận"
                                v-decorator="[
                                    'code',
                                    {
                                        rules: codeRules
                                    }
                                ]"
                            >
                                <a-icon slot="prefix" style="margin-top: 2px" type="qrcode" />
                            </a-input>
                        </a-col>
                        <a-col :span="10" :offset="1">
                            <a-button
                                size="large"
                                class="float-right"
                                style="width: 100%"
                                @click="onRequest"
                            >
                                Gửi mã xác nhận
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item>
                    <a-button htmlType="submit" type="primary" size="large" style="width: 100%">
                        Đăng nhập
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout';
import { setAuthorization } from '@/utils/request';
import { getFirstRoutePath } from '@/utils/routerUtil';
import { mapActions, mapMutations } from 'vuex';
import { codeRules, emailRules, passwordRules } from './const';

export default {
    name: 'Login',
    components: { CommonLayout },
    data() {
        return {
            form: this.$form.createForm(this),
            emailRules,
            passwordRules,
            codeRules
        };
    },
    computed: {
        systemName() {
            return this.$store.state.setting.systemName;
        },
        curPath() {
            return this.$route.name;
        }
    },
    methods: {
        ...mapMutations('account', ['setUser']),
        ...mapActions('account', ['requestLogin', 'login', 'getProfile']),
        async onRequest() {
            const email = this.form.getFieldValue('email').trim();
            this.form.setFieldsValue({ email });
            try {
                await this.requestLogin({ email });
                this.$notification['success']({
                    message: 'Gửi mã xác nhận thành công, vui lòng kiểm tra email'
                });
            } catch {
                this.$notification['error']({
                    message: 'Gửi mã xác nhận không thành công'
                });
            }
        },
        onSubmit(e) {
            e.preventDefault();
            this.form.validateFields(async (err) => {
                if (!err) {
                    const email = this.form.getFieldValue('email').trim();
                    const password = this.form.getFieldValue('password');
                    const code = this.form.getFieldValue('code').trim();

                    this.form.setFieldsValue({ email, code });

                    try {
                        const res = await this.login({ email, password, code });
                        await this.afterLogin(res);
                    } catch (error) {
                        const message = error.response.data.message;
                        this.$notification['error']({
                            message:
                                message === 'user not found'
                                    ? 'Email này chưa tồn tại trên hệ thống'
                                    : message === 'code invalid'
                                    ? 'Mã xác nhận chưa chính xác'
                                    : message === 'login fail'
                                    ? 'Mật khẩu chưa chính xác'
                                    : message === 'locked. please wait 15 minutes'
                                    ? 'Tài khoản đã bị khoá, vui lòng thử lại sau'
                                    : 'Đăng nhập không thành công'
                        });
                    }
                }
            });
        },
        async afterLogin(res) {
            setAuthorization(res.data.token);
            this.setUser(res.data);
            await this.getProfile();
            const path = getFirstRoutePath();
            if (!path) {
                this.$notification['error']({
                    message: 'Tài khoản này không có quyền truy cập trang web'
                });
            } else {
                this.$router.push(path);
                this.$notification['success']({
                    message: 'Đăng nhập thành công'
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.common-layout {
    .top {
        text-align: center;
        .header {
            height: 44px;
            line-height: 44px;
            a {
                text-decoration: none;
            }
            .logo {
                height: 44px;
                vertical-align: top;
                margin-right: 16px;
            }
            .title {
                font-size: 33px;
                color: @title-color;
                font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
                font-weight: 600;
                position: relative;
                top: 2px;
            }
        }
        .desc {
            font-size: 14px;
            color: @text-color-second;
            margin-top: 12px;
            margin-bottom: 40px;
        }
    }
    .login {
        width: 368px;
        margin: 0 auto;
        @media screen and (max-width: 576px) {
            width: 95%;
        }
        @media screen and (max-width: 320px) {
            .captcha-button {
                font-size: 14px;
            }
        }
        .icon {
            font-size: 24px;
            color: @text-color-second;
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: @primary-color;
            }
        }
    }
}
</style>
