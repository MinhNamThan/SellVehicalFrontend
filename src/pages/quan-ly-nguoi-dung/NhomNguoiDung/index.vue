<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <h1 :class="width < 576 ? '' : 'title'">Danh sách nhóm người dùng</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button icon="plus" class="float-md-right" type="primary" @click="showAddModal">
                    Thêm nhóm
                </a-button>
            </a-col>
        </a-row>

        <p>{{ getStatistics() }}</p>

        <a-table
            bordered
            :rowKey="(r, i) => i"
            :columns="columns"
            :dataSource="listNhomNguoiDung"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="permission" slot-scope="text, record">
                <a-button
                    shape="circle"
                    icon="safety"
                    type="primary"
                    @click="showPermissionModal(record)"
                />
            </template>
            <template slot="action" slot-scope="text, record">
                <a-tooltip title="Chỉnh sửa thông tin">
                    <a-button
                        shape="circle"
                        icon="form"
                        class="btn bg-green mr-2"
                        type="link"
                        @click="showUpdateModal(record)"
                    />
                </a-tooltip>
                <a-popconfirm
                    title="Bạn có chắc chắn muốn xoá nhóm người dùng này không?"
                    @confirm="onDelete(record)"
                >
                    <a-tooltip title="Xoá nhóm người dùng">
                        <a-button shape="circle" icon="delete" type="danger" />
                    </a-tooltip>
                </a-popconfirm>
            </template>
        </a-table>
        <a-modal v-model="addModalVisible" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">
                    {{
                        addForm.id ? 'Chỉnh sửa thông tin nhóm người dùng' : 'Thêm nhóm người dùng'
                    }}
                </h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="addForm"
                :rules="addFormRules"
                ref="addForm"
            >
                <a-form-model-item label="Tên nhóm" prop="name">
                    <a-input v-model="addForm.name" />
                </a-form-model-item>
                <a-form-model-item label="Mô tả" prop="desc">
                    <a-textarea v-model="addForm.desc" />
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideAddModal">Huỷ</a-button>
                    <a-button type="primary" @click="addForm.id ? edit() : add()">Lưu</a-button>
                </div>
            </template>
        </a-modal>
        <a-modal v-model="permissionModalVisible" destroyOnClose :width="1200">
            <template slot="title">
                <h1 class="title m-0">Phân quyền cho nhóm người dùng</h1>
            </template>
            <a-table
                bordered
                :rowKey="(r, i) => i"
                :columns="permissionColumns"
                :dataSource="object2table(addPermission)"
                :pagination="false"
            >
                <template slot="stt" slot-scope="text, record, index">
                    {{ index + 1 }}
                </template>
                <span slot="Truy cập">
                    <a-checkbox
                        :indeterminate="idmAccess"
                        :checked="checkAllAccess"
                        @click="modifiable ? onCheckAllAccess() : () => {}"
                    >
                    </a-checkbox>
                    Truy cập
                </span>
                <template slot="access" slot-scope="text, record">
                    <a-checkbox
                        :checked="text"
                        @click="modifiable ? changePermission(record, 'access') : () => {}"
                    />
                </template>
                <span slot="Thay đổi">
                    <a-checkbox
                        :indeterminate="idmModify"
                        :checked="checkAllModify"
                        @click="modifiable ? onCheckAllModify() : () => {}"
                    >
                    </a-checkbox>
                    Thay đổi
                </span>
                <template slot="modify" slot-scope="text, record">
                    <a-checkbox
                        :checked="text"
                        @click="modifiable ? changePermission(record, 'modify') : () => {}"
                    />
                </template>
            </a-table>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hidePermissionModal">
                        {{ modifiable ? 'Huỷ' : 'Đóng' }}
                    </a-button>
                    <a-button type="primary" @click="applyPermission" v-if="modifiable"
                        >Lưu</a-button
                    >
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import {
    addFormRules,
    columns,
    defaultPermissionList,
    pagination,
    permissionColumns
} from './const';

export default {
    name: 'NhomNguoiDung',
    data() {
        return {
            columns: null,
            pagination,
            addModalVisible: false,
            addForm: {},
            addFormRules,
            permissionColumns,
            permissionModalVisible: false,
            addPermission: {},
            idmAccess: false,
            checkAllAccess: false,
            idmModify: false,
            checkAllModify: false,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('nhomNguoiDung', ['listNhomNguoiDung']),
        ...mapGetters('account', ['user', 'permissions'])
    },
    watch: {
        listNhomNguoiDung(newVal) {
            this.pagination.total = newVal.length;
        },
        addPermission(newVal) {
            this.visualCheckAll(newVal);
        }
    },
    methods: {
        ...mapActions('account', ['getProfile']),
        ...mapActions('nhomNguoiDung', [
            'saveNhomNguoiDung',
            'updateNhomNguoiDung',
            'getListNhomNguoiDung',
            'deleteNhomNguoiDung'
        ]),
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
        handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
        },
        showAddModal() {
            this.addForm = {};
            this.addModalVisible = true;
        },
        showUpdateModal(item) {
            this.addForm = JSON.parse(JSON.stringify(item));
            this.addModalVisible = true;
        },
        showPermissionModal(item) {
            this.addForm = JSON.parse(JSON.stringify(item));
            console.log(this.addForm);
            this.addPermission = this.addForm.permission;
            this.permissionModalVisible = true;
        },
        hideAddModal() {
            this.addModalVisible = false;
        },
        hidePermissionModal() {
            this.permissionModalVisible = false;
        },
        add() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.addForm);
                    await this.saveNhomNguoiDung({
                        ...this.addForm,
                        permission: defaultPermissionList
                    });
                    await this.getListNhomNguoiDung();
                    this.addModalVisible = false;
                    this.$notification['success']({
                        message: 'Thêm nhóm thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Thêm nhóm không thành công'
                    });
                }
            });
        },
        edit() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.addForm);
                    await this.updateNhomNguoiDung(this.addForm);
                    await this.getListNhomNguoiDung();
                    if (this.user.group_id === this.addForm.id) await this.getProfile();
                    this.addModalVisible = false;
                    this.$notification['success']({
                        message: 'Cập nhật nhóm thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật nhóm không thành công'
                    });
                }
            });
        },
        async onDelete(item) {
            try {
                await this.deleteNhomNguoiDung(item.id);
                await this.getListNhomNguoiDung();
                if (this.user.group_id === item.id) this.$router.push('/dang-nhap');
                this.$notification['success']({
                    message: 'Xoá nhóm thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá nhóm không thành công'
                });
            }
        },
        object2table(permission) {
            let table = [];
            for (let pms in defaultPermissionList) {
                if (pms in permission) {
                    console.log(pms);
                    table.push({
                        name: defaultPermissionList[pms].name,
                        category: defaultPermissionList[pms].category,
                        key: pms,
                        ...permission[pms]
                    });
                }
            }
            return table;
        },
        async applyPermission() {
            try {
                await this.updateNhomNguoiDung({
                    ...this.addForm,
                    permission: this.addPermission
                });
                await this.getListNhomNguoiDung();
                this.permissionModalVisible = false;
                if (this.user.group_id === this.addForm.id) {
                    if (this.addPermission['nhom-nguoi-dung'].access) await this.getProfile();
                    else this.$router.push('/403');
                    if (!this.addPermission['nhom-nguoi-dung'].modify) {
                        this.modifiable = false;
                        this.columns = this.columns.slice(0, -1);
                    }
                }
                this.$notification['success']({
                    message: 'Cập nhật phân quyền thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Cập nhật phân quyền không thành công'
                });
            }
        },
        onCheckAllAccess() {
            for (const r in this.addPermission) {
                this.addPermission[r].access = !this.checkAllAccess;
                if (this.checkAllAccess) {
                    this.addPermission[r].modify = false;
                }
            }
            this.visualCheckAll(this.addPermission);
        },
        onCheckAllModify() {
            for (const r in this.addPermission) {
                this.addPermission[r].modify = !this.checkAllModify;
                if (!this.checkAllModify) {
                    this.addPermission[r].access = true;
                }
            }
            this.visualCheckAll(this.addPermission);
        },
        visualCheckAll(addPermission) {
            let checkTrueAll = true;
            let checkFalseAll = false;
            for (const r in addPermission) {
                checkTrueAll = checkTrueAll && this.addPermission[r].access;
                checkFalseAll = checkFalseAll || this.addPermission[r].access;
            }
            this.checkAllAccess = checkTrueAll ? true : false;
            this.idmAccess = this.checkAllAccess ? false : checkFalseAll;
            checkTrueAll = true;
            checkFalseAll = false;
            for (const r in addPermission) {
                checkTrueAll = checkTrueAll && this.addPermission[r].modify;
                checkFalseAll = checkFalseAll || this.addPermission[r].modify;
            }
            this.checkAllModify = checkTrueAll ? true : false;
            this.idmModify = this.checkAllModify ? false : checkFalseAll;
        },
        changePermission(record, type) {
            let key = record.key;
            if (type == 'access') {
                let newAccess = !this.addPermission[key].access;
                this.addPermission[key].access = newAccess;
                if (!newAccess) {
                    this.addPermission[key].modify = false;
                }
            }
            if (type == 'modify') {
                let newModify = !this.addPermission[key].modify;
                this.addPermission[key].modify = newModify;
                if (newModify) {
                    this.addPermission[key].access = true;
                }
            }
            this.visualCheckAll(this.addPermission);
        }
    },
    async mounted() {
        await this.getListNhomNguoiDung();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable ? columns : columns.slice(0, -1);
    }
};
</script>
