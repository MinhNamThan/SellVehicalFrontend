<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách người dùng</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button
                    icon="plus"
                    class="float-md-right"
                    :style="{
                        marginTop: '-2px'
                    }"
                    type="primary"
                    @click="showAddModal"
                >
                    Thêm người dùng
                </a-button>
            </a-col>
        </a-row>

        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <p>{{ getStatistics() }}</p>
            </a-col>
            <a-col :xs="24" :sm="24" :md="16">
                <div
                    class="float-md-right mb-2"
                    :style="{
                        marginTop: '-8px'
                    }"
                >
                    <a-input-search
                        placeholder="Tìm kiếm..."
                        class="input-search"
                        @search="onSearch"
                        allowClear
                    />
                </div>
            </a-col>
        </a-row>

        <a-table
            bordered
            :rowKey="(r, i) => r.id"
            :columns="columns"
            :dataSource="listNguoiDung"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="group" slot-scope="text, record">
                {{ record.group && record.group.name }}
            </template>
            <template slot="agent" slot-scope="text, record">
                {{ record.agent && record.agent.name }}
            </template>
            <template slot="type" slot-scope="text">
                {{ text === 'ADMIN' ? 'Trang admin' : 'Trang đại lý' }}
            </template>
            <template slot="action" slot-scope="text, record">
                <a-space :direction="width < 1757 ? 'vertical' : 'horizontal'">
                    <a-tooltip title="Chỉnh sửa thông tin">
                        <a-button
                            shape="circle"
                            icon="form"
                            class="bg bg-green"
                            type="link"
                            @click="showUpdateModal(record)"
                        />
                    </a-tooltip>
                    <a-tooltip title="Đổi mật khẩu">
                        <a-button
                            shape="circle"
                            icon="lock"
                            class="btn bg-orange"
                            type="link"
                            @click="showChangePassword(record)"
                        />
                    </a-tooltip>
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn xoá người dùng này không?"
                        @confirm="onDelete(record)"
                    >
                        <a-tooltip title="Xoá người dùng">
                            <a-button shape="circle" icon="delete" type="danger" />
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </a-table>
        <a-modal v-model="addModalVisible" destroyOnClose :width="750">
            <template slot="title">
                <h1 class="title m-0">
                    {{ addForm.id ? 'Chỉnh sửa thông tin người dùng' : 'Thêm người dùng' }}
                </h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                class="form"
                :model="addForm"
                :rules="addFormRules"
                ref="addForm"
            >
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-model-item label="Email" prop="email">
                            <a-input v-model="addForm.email" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Họ và tên" prop="name">
                            <a-input v-model="addForm.name" /> </a-form-model-item
                    ></a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Số điện thoại" prop="mobile">
                            <a-input v-model="addForm.mobile" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12" v-if="!addForm.id">
                        <a-form-model-item label="Mật khẩu" prop="password">
                            <a-input-password
                                autocomplete="new-password"
                                v-model="addForm.password"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Đại lý" prop="agentId">
                            <a-select
                                show-search
                                v-model="addForm.agentId"
                                :defaultActiveFirstOption="false"
                                :showArrow="false"
                                :filterOption="false"
                                :notFoundContent="null"
                                @search="searchDaiLy"
                                @focus="searchDaiLy('')"
                            >
                                <a-select-option
                                    v-for="daiLy in listDaiLy"
                                    :key="daiLy.id"
                                    :value="daiLy.id"
                                >
                                    {{ daiLy.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12" v-if="addForm.type === 'ADMIN'">
                        <a-form-model-item label="Nhóm người dùng" prop="group_id">
                            <a-select v-model="addForm.group_id">
                                <a-select-option
                                    v-for="nhom in listNhomNguoiDung"
                                    :key="nhom.id"
                                    :value="nhom.id"
                                >
                                    {{ nhom.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-radio-group v-model="addForm.type" class="float-left mt-1">
                        <a-radio value="ADMIN"> Trang admin </a-radio>
                        <a-radio value="AGENT"> Trang đại lý </a-radio>
                    </a-radio-group>
                    <a-button @click="hideAddModal">Huỷ</a-button>
                    <a-button type="primary" @click="addForm.id ? edit() : add()">Lưu</a-button>
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
                <a-form-model-item label="Mật khẩu mới" prop="password">
                    <a-input-password v-model="changeForm.password" />
                </a-form-model-item>
                <a-form-model-item label="Nhập lại mật khẩu mới" prop="rePassword">
                    <a-input-password v-model="changeForm.rePassword" />
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
                    <a-button @click="hideChangePassword">Huỷ</a-button>
                    <a-button type="primary" @click="changePassword">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import apiService from '@/services/nguoi-dung';
import debounce from 'lodash.debounce';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import { addFormRules, changeFormRules, columns1, columns2, pagination } from './const';

export default {
    name: 'NguoiDung',
    data() {
        const checkTrungPassword = (rule, value, callback) => {
            if (this.changeForm.password !== value) {
                callback(new Error('Mật khẩu không khớp'));
            } else {
                callback();
            }
        };
        return {
            columns: null,
            pagination,
            search: '',
            addModalVisible: false,
            addForm: {},
            addFormRules,
            changePasswordVisible: false,
            changeForm: {},
            changeFormRules: changeFormRules(checkTrungPassword),
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('nhomNguoiDung', ['listNhomNguoiDung']),
        ...mapState('daiLy', ['listDaiLy']),
        ...mapState('nguoiDung', ['listNguoiDung', 'metadata']),
        ...mapGetters('account', ['user', 'permissions'])
    },
    watch: {
        width(newVal) {
            this.columns = this.modifiable
                ? newVal < 1757
                    ? columns2
                    : columns1
                : newVal < 1757
                ? columns2.slice(0, -1)
                : columns1.slice(0, -1);
        }
    },
    methods: {
        ...mapActions('nhomNguoiDung', ['getListNhomNguoiDung']),
        ...mapActions('daiLy', ['getListDaiLy']),
        ...mapActions('nguoiDung', [
            'saveNguoiDung',
            'updateNguoiDung',
            'getListNguoiDung',
            'deleteNguoiDung'
        ]),
        ...mapActions('account', ['getProfile']),
        async getData() {
            await this.getListNguoiDung({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                search: this.search
            });
            this.pagination.total = this.metadata.total;
        },
        getIndex(index) {
            return (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
        },
        getStatistics() {
            return `${this.pagination.total === 0 ? 0 : this.getIndex(0)}-${
                this.pagination.current * this.pagination.pageSize > this.pagination.total
                    ? this.pagination.total
                    : this.getIndex(this.pagination.pageSize - 1)
            } trong tổng số  ${this.pagination.total}`;
        },
        async handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            await this.getData();
        },
        async onSearch(value) {
            this.pagination.current = 1;
            this.search = value;
            await this.getData();
        },
        async showAddModal() {
            this.addForm = { type: 'ADMIN' };
            await this.getListNhomNguoiDung();
            this.addModalVisible = true;
        },
        async showUpdateModal(item) {
            this.addForm = JSON.parse(JSON.stringify(item));
            await this.getListNhomNguoiDung();
            if (item.agent) await this.getListDaiLy({ per: 50, page: 1, search: item.agent.name });
            this.addModalVisible = true;
        },
        showChangePassword(item) {
            this.changeForm = JSON.parse(JSON.stringify(item));
            this.changePasswordVisible = true;
        },
        hideAddModal() {
            this.addModalVisible = false;
        },
        hideChangePassword() {
            this.changePasswordVisible = false;
        },
        async checkEmail() {
            const { data } = await apiService.getListNguoiDung({
                per: 50,
                page: 1,
                search: this.addForm.email.trim()
            });
            const nguoiDung = data.items.find((item) => item.email === this.addForm.email.trim());
            return nguoiDung && nguoiDung.id !== this.addForm.id;
        },
        add() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) return;

                const emailExist = await this.checkEmail();
                if (emailExist) {
                    this.$notification['error']({
                        message: 'Email này đã tồn tại trong hệ thống'
                    });
                    return;
                }

                try {
                    const password = this.addForm.password;
                    trimObject(this.addForm);
                    this.addForm.password = password;
                    await this.saveNguoiDung(this.addForm);
                    this.search = '';
                    await this.getData();
                    this.addModalVisible = false;
                    this.$notification['success']({
                        message: 'Thêm người dùng thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Thêm người dùng không thành công'
                    });
                }
            });
        },
        edit() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) return;

                const emailExist = await this.checkEmail();
                if (emailExist) {
                    this.$notification['error']({
                        message: 'Email này đã tồn tại trong hệ thống'
                    });
                    return;
                }

                try {
                    if (this.addForm.type === 'AGENT')
                        this.addForm = { ...this.addForm, group_id: null, group: null };
                    trimObject(this.addForm);
                    await this.updateNguoiDung(this.addForm);
                    await this.getData();
                    this.addModalVisible = false;
                    if (this.user.id === this.addForm.id) {
                        const group_id = this.user.group_id;
                        await this.getProfile();
                        if (group_id !== this.addForm.group_id) {
                            if (
                                !this.addForm.group_id ||
                                !this.user.group.permission['nguoi-dung'].access
                            )
                                this.$router.push('/403');
                            if (!this.user.group.permission['nguoi-dung'].modify) {
                                this.modifiable = false;
                                this.columns = this.columns.slice(0, -1);
                            }
                        }
                    }
                    this.$notification['success']({
                        message: 'Cập nhật người dùng thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật người dùng không thành công'
                    });
                }
            });
        },
        async onDelete(item) {
            try {
                await this.deleteNguoiDung(item.id);
                await this.getData();
                if (this.user.id === item.id) this.$router.push('/dang-nhap');
                this.$notification['success']({
                    message: 'Xoá người dùng thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá người dùng không thành công do người dùng có báo giá'
                });
            }
        },
        changePassword() {
            this.$refs.changeForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    await this.updateNguoiDung(this.changeForm);
                    await this.getData();
                    this.changePasswordVisible = false;
                    if (this.user.id === this.changeForm.id) this.$router.push('/dang-nhap');
                    this.$notification['success']({
                        message: 'Cập nhật mật khẩu thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật mật khẩu không thành công'
                    });
                }
            });
        },
        searchDaiLy: debounce(function (value) {
            this.getListDaiLy({ per: 50, page: 1, search: value });
        }, 300)
    },
    async mounted() {
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable
            ? this.width < 1757
                ? columns2
                : columns1
            : this.width < 1757
            ? columns2.slice(0, -1)
            : columns1.slice(0, -1);
    }
};
</script>

<style scoped>
.input-search {
    width: 300px;
    z-index: 1;
}
@media screen and (max-width: 768px) {
    .input-search {
        width: 100%;
        z-index: 1;
    }
}
</style>
