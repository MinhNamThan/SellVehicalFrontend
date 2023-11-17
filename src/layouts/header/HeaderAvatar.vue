<template>
    <div>
        <a-dropdown>
            <div class="header-avatar" style="cursor: pointer">
                <span class="name mr-2">{{ user.name }}</span>
                <a-avatar class="avatar" size="small" shape="circle" src="avatar.png" />
            </div>
            <a-menu :class="['avatar-menu']" slot="overlay">
                <a-menu-item @click="doShowProfile">
                    <a-icon type="user" />
                    <span>Trang cá nhân</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item
                    @click="
                        () => {
                            changeForm = {};
                            changePasswordVisible = true;
                        }
                    "
                >
                    <a-icon type="lock" />
                    <span>Đổi mật khẩu</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="doLogout">
                    <a-icon style="margin-right: 8px" type="poweroff" />
                    <span>Đăng xuất</span>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
        <a-modal v-model="updateProfileVisible" destroyOnClose :width="500">
            <template slot="title">
                <h1 class="title m-0">Thông tin cá nhân</h1>
            </template>

            <a-descriptions :column="1">
                <a-descriptions-item label="Email">{{ profileForm.email }}</a-descriptions-item>
                <a-descriptions-item label="Nhóm người dùng">
                    {{ profileForm.group ? profileForm.group.name : 'Không có thông tin' }}
                </a-descriptions-item>
                <a-descriptions-item label="Đại lý">
                    {{ profileForm.agent ? profileForm.agent.name : 'Không có thông tin' }}
                </a-descriptions-item>
            </a-descriptions>
            <a-form-model
                class="form"
                :model="profileForm"
                :rules="profileFormRules"
                ref="profileForm"
            >
                <a-form-model-item label="Họ và tên" prop="name">
                    <a-input v-model="profileForm.name" />
                </a-form-model-item>
                <a-form-model-item label="Số điện thoại" prop="mobile">
                    <a-input v-model="profileForm.mobile" />
                </a-form-model-item>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="updateProfileVisible = false">Huỷ</a-button>
                    <a-button type="primary" @click="doUpdateProfile">Lưu</a-button>
                </div>
            </template>
        </a-modal>
        <a-modal v-model="changePasswordVisible" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Đổi mật khẩu</h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                class="form"
                :model="changeForm"
                :rules="changeFormRules"
                ref="changeForm"
            >
                <a-form-model-item label="Mật khẩu cũ" prop="oldPassword">
                    <a-input-password v-model="changeForm.oldPassword" />
                </a-form-model-item>
                <a-form-model-item label="Mật khẩu mới" prop="newPassword">
                    <a-input-password v-model="changeForm.newPassword" />
                </a-form-model-item>
                <a-form-model-item label="Nhập lại mật khẩu mới" prop="reNewPassword">
                    <a-input-password v-model="changeForm.reNewPassword" />
                </a-form-model-item>
                <div class="mb-3">
                    <i class="float-right">
                        <span style="color: red">* </span>
                        yêu cầu tối thiểu 8 kí tự bất kì
                    </i>
                </div>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="changePasswordVisible = false">Huỷ</a-button>
                    <a-button type="primary" @click="doChangePassword">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { trimObject } from '../../utils/formUtil';

export default {
    name: 'HeaderAvatar',
    watch: {},
    data() {
        const checkKhacPassword = (rule, value, callback) => {
            if (this.changeForm.oldPassword == value) {
                callback(new Error('Mật khẩu mới phải khác mật khẩu cũ'));
            } else {
                callback();
            }
        };
        const checkTrungPassword = (rule, value, callback) => {
            if (this.changeForm.newPassword != value) {
                callback(new Error('Mật khẩu không khớp'));
            } else {
                callback();
            }
        };
        return {
            updateProfileVisible: false,
            profileForm: {},
            profileFormRules: {
                name: [
                    {
                        required: true,
                        message: 'Vui lòng nhập họ và tên',
                        whitespace: true
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại',
                        whitespace: true
                    }
                ]
            },
            nChangePassword: 0,
            changePasswordVisible: false,
            changeForm: {},
            changeFormRules: {
                oldPassword: [
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu'
                    },
                    {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự'
                    }
                ],
                newPassword: [
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu'
                    },
                    {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự'
                    },
                    {
                        validator: checkKhacPassword,
                        trigger: 'change'
                    }
                ],
                reNewPassword: [
                    {
                        required: true,
                        message: 'Vui lòng nhập lại mật khẩu'
                    },
                    {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự'
                    },
                    {
                        validator: checkTrungPassword,
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters('account', ['user'])
    },
    methods: {
        ...mapActions('account', ['getProfile', 'updateProfile', 'changePassword', 'logout']),
        doLogout() {
            this.logout();
            this.$router.push('/dang-nhap');
        },
        async doShowProfile() {
            await this.getProfile();
            this.profileForm = JSON.parse(JSON.stringify(this.user));
            this.updateProfileVisible = true;
        },
        doUpdateProfile() {
            this.$refs.profileForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.profileForm);
                    await this.updateProfile(this.profileForm);
                    this.updateProfileVisible = false;
                    this.$notification['success']({
                        message: 'Cập nhật thông tin thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật thông tin không thành công'
                    });
                }
            });
        },
        doChangePassword() {
            this.$refs.changeForm.validate((valid) => {
                if (!valid) return;
                const payload = {
                    email: this.user.email,
                    oldPassword: this.changeForm.oldPassword,
                    password: this.changeForm.newPassword
                };
                this.changePassword(payload)
                    .then(this.afterChangePassword)
                    .catch(() => {
                        this.$notification['error']({
                            message: 'Mật khẩu cũ không đúng'
                        });
                        this.nChangePassword += 1;
                        if (this.nChangePassword > 3) {
                            this.$notification['error']({
                                message: 'Nhập sai quá 3 lần'
                            });
                            this.nChangePassword = 0;
                            this.doLogout();
                        }
                    });
            });
        },
        afterChangePassword() {
            this.$router.push('/dang-nhap');
            this.$notification['success']({
                message: 'Cập nhật mật khẩu thành công'
            });
        }
    }
};
</script>

<style lang="less">
.header-avatar {
    display: inline-flex;
    .avatar,
    .name {
        align-self: center;
    }
    .avatar {
        margin-right: 8px;
    }
    .name {
        font-weight: 500;
    }
}
.avatar-menu {
    width: 160px;
}
</style>
