<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8"> <h1 class="title">Danh sách khách hàng</h1> </a-col>
            <a-col v-if="modifiable">
                <a-button
                    icon="swap"
                    class="float-md-right"
                    :style="{
                        marginTop: '-2px'
                    }"
                    type="primary"
                    @click="showChangeModal"
                >
                    Đổi tài khoản
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
            :rowKey="(r, i) => i"
            :rowClassName="rowClassName"
            :customRow="customRow"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="group" slot-scope="text">
                <div v-if="text">
                    <span v-for="(group, index) in text" :key="index">
                        <a-tag class="mb-2" :color="getTagColor(group.type)">{{
                            group.name
                        }}</a-tag>
                    </span>
                </div>
            </template>
            <template slot="status" slot-scope="text, record">
                <a-tag :color="record.disabled ? '#ff4d52' : '#28a745'" class="m-0">
                    {{ record.disabled ? 'Không hoạt động' : 'Hoạt động' }}
                </a-tag>
            </template>
            <template slot="date" slot-scope="text">
                {{ moment(text).format('DD/MM/YYYY') }}
            </template>
            <template slot="action" slot-scope="text, record">
                <a-tooltip title="Danh sách thiết bị">
                    <a-button
                        shape="circle"
                        icon="database"
                        type="primary"
                        @click.stop="showDevicesModal(record)"
                    />
                </a-tooltip>
            </template>
        </a-table>

        <a-modal v-model="detailsModalVisible" destroyOnClose :width="width < 900 ? null : 900">
            <template slot="title">
                <h1 class="title m-0">Thông tin tài khoản</h1>
            </template>

            <a-descriptions
                :column="width < 630 ? 1 : 2"
                :layout="width < 420 ? 'vertical' : 'horizontal'"
                bordered
            >
                <a-descriptions-item label="Tên khách hàng">
                    {{ detailsForm.name }}
                </a-descriptions-item>
                <a-descriptions-item label="Trạng thái">
                    <a-tag :color="detailsForm.disabled ? '#ff4d52' : '#28a745'">
                        {{ detailsForm.disabled ? 'Không hoạt động' : 'Hoạt động' }}
                    </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Email">
                    {{ detailsForm.email }}
                </a-descriptions-item>
                <a-descriptions-item label="Ngày đăng ký">
                    {{ moment(detailsForm.createdAt).format('DD/MM/YYYY') }}
                </a-descriptions-item>
                <a-descriptions-item label="Số điện thoại">
                    {{ detailsForm.phoneNumber ? detailsForm.phoneNumber : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Ngày cập nhật">
                    {{ moment(detailsForm.updatedAt).format('DD/MM/YYYY') }}
                </a-descriptions-item>
                <a-descriptions-item label="Nhóm khách hàng">
                    <div v-if="detailsForm.groups">
                        <span v-for="(group, index) in detailsForm.groups" :key="index">
                            <a-tag class="m-1" :color="getTagColor(group.type)">
                                {{ group.name }}
                            </a-tag>
                        </span>
                    </div>
                </a-descriptions-item>
            </a-descriptions>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <div v-if="width >= 562">
                        <div class="float-left" v-if="modifiable">
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn kick out tài khoản này không?"
                                @confirm="onKickOut(detailsForm)"
                            >
                                <a-button icon="logout" type="primary" class="px-2"
                                    >Kick out tài khoản</a-button
                                >
                            </a-popconfirm>
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn mở khóa tài khoản này không?"
                                @confirm="toggleStatus(detailsForm)"
                                v-if="detailsForm.disabled"
                            >
                                <a-button icon="unlock" class="btn bg-orange px-2" type="link">
                                    Mở khóa tài khoản
                                </a-button>
                            </a-popconfirm>
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn khóa tài khoản này không?"
                                @confirm="toggleStatus(detailsForm)"
                                v-else
                            >
                                <a-button icon="lock" class="btn bg-orange px-2" type="link">
                                    Khóa tài khoản
                                </a-button>
                            </a-popconfirm>
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn xoá tài khoản này không?"
                                @confirm="onDelete(detailsForm)"
                            >
                                <a-button icon="delete" type="danger" class="px-2">
                                    Xoá tài khoản
                                </a-button>
                            </a-popconfirm>
                        </div>
                        <a-button @click="hideDetailsModal">Đóng</a-button>
                    </div>
                    <div v-else>
                        <a-row
                            class="mb-3"
                            type="flex"
                            justify="center"
                            :gutter="[10, 10]"
                            v-if="modifiable"
                        >
                            <a-col>
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn kick out tài khoản này không?"
                                    @confirm="onKickOut(detailsForm)"
                                >
                                    <a-button icon="logout" type="primary" class="px-2"
                                        >Kick out tài khoản</a-button
                                    >
                                </a-popconfirm>
                            </a-col>
                            <a-col v-if="detailsForm.disabled">
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn mở khóa tài khoản này không?"
                                    @confirm="toggleStatus(detailsForm)"
                                >
                                    <a-button icon="unlock" class="btn bg-orange px-2" type="link">
                                        Mở khóa tài khoản
                                    </a-button>
                                </a-popconfirm>
                            </a-col>
                            <a-col v-else>
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn khóa tài khoản này không?"
                                    @confirm="toggleStatus(detailsForm)"
                                >
                                    <a-button icon="lock" class="btn bg-orange px-2" type="link">
                                        Khóa tài khoản
                                    </a-button>
                                </a-popconfirm>
                            </a-col>
                            <a-col>
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn xoá tài khoản này không?"
                                    @confirm="onDelete(detailsForm)"
                                >
                                    <a-button icon="delete" type="danger" class="px-2">
                                        Xoá tài khoản
                                    </a-button>
                                </a-popconfirm>
                            </a-col>
                        </a-row>
                        <a-row type="flex" justify="center">
                            <a-col>
                                <a-button @click="hideDetailsModal">Đóng</a-button>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="devicesModalVisible" destroyOnClose :width="1200">
            <template slot="title">
                <h1 class="title m-0">Danh sách thiết bị</h1>
            </template>
            <DanhSachThietBi :khachHangEmail="khachHangEmail" />
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideDevicesModal">Đóng</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="changeModalVisible" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Đổi tài khoản</h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="changeForm"
                :rules="changeFormRules"
                ref="changeForm"
            >
                <a-form-model-item label="Email 1" prop="email1">
                    <a-input v-model="changeForm.email1" />
                </a-form-model-item>
                <a-form-model-item label="Email 2" prop="email2">
                    <a-input v-model="changeForm.email2" />
                </a-form-model-item>
            </a-form-model>
            <p class="mt-3" :style="{ marginBottom: '-12px' }">
                {{ changeModalInfo }}
            </p>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideChangeModal">Hủy</a-button>
                    <a-button type="primary" @click="onSwap">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import DanhSachThietBi from '../../quan-ly-thiet-bi/ThietBi/DanhSachThietBi';
import { changeFormRules, changeModalInfo, columns1, columns2, pagination, types } from './const';

export default {
    name: 'KhachHang',
    components: { DanhSachThietBi },
    data() {
        const checkKhacEmail = (rule, value, callback) => {
            if (this.changeForm.email1.trim() === value.trim()) {
                callback(new Error('Email 2 phải khác email 1'));
            } else {
                callback();
            }
        };
        return {
            columns: null,
            pagination,
            search: '',
            detailsModalVisible: false,
            devicesModalVisible: false,
            changeModalVisible: false,
            detailsForm: {},
            changeForm: {},
            changeFormRules: changeFormRules(checkKhacEmail),
            changeModalInfo,
            khachHangEmail: null,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('nhomKhachHang', ['listNhomKhachHang']),
        ...mapState('khachHang', ['listKhachHang', 'metadata']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            return this.listKhachHang.map((item) => {
                const groups = [];
                this.listNhomKhachHang.forEach((i) => {
                    if (i.members.find((itm) => itm === item.id) !== undefined)
                        groups.push({ name: i.name, type: i.type });
                });
                return { ...item, groups };
            });
        }
    },
    watch: {
        width(newVal) {
            this.columns = newVal < 1682 ? columns2 : columns1;
        }
    },
    methods: {
        moment,
        ...mapActions('nhomKhachHang', ['getListNhomKhachHang']),
        ...mapActions('khachHang', [
            'updateKhachHang',
            'getListKhachHang',
            'kickOutKhachHang',
            'swapKhachHang',
            'deleteKhachHang'
        ]),
        async getData() {
            await this.getListKhachHang({
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
        getTagColor(type) {
            return types.find((item) => item.name === type).color;
        },
        handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.getData();
        },
        rowClassName: () => 'clickable-row',
        customRow(record) {
            return {
                on: {
                    click: () => {
                        this.showDetailsModal(record);
                    }
                }
            };
        },
        onSearch(value) {
            this.pagination.current = 1;
            this.search = value;
            this.getData();
        },
        showDetailsModal(item) {
            this.detailsForm = JSON.parse(JSON.stringify(item));
            this.detailsModalVisible = true;
        },
        showDevicesModal(item) {
            this.khachHangEmail = item.email;
            this.devicesModalVisible = true;
        },
        showChangeModal(item) {
            this.changeForm = JSON.parse(JSON.stringify(item));
            this.changeModalVisible = true;
        },
        hideDetailsModal() {
            this.detailsModalVisible = false;
        },
        hideDevicesModal() {
            this.devicesModalVisible = false;
        },
        hideChangeModal() {
            this.changeModalVisible = false;
        },
        async toggleStatus(item) {
            try {
                item = { ...item, disabled: !item.disabled };
                await this.updateKhachHang(item);
                await this.getData();
                this.detailsForm = item;
                if (item.disabled)
                    this.$notification['success']({
                        message: 'Khoá tài khoản thành công'
                    });
                else
                    this.$notification['success']({
                        message: 'Mở khoá tài khoản thành công'
                    });
            } catch (error) {
                if (item.disabled)
                    this.$notification['error']({
                        message: 'Khoá tài khoản không thành công'
                    });
                else
                    this.$notification['error']({
                        message: 'Mở khoá tài khoản không thành công'
                    });
            }
        },
        async onKickOut(item) {
            try {
                await this.kickOutKhachHang(item.id);
                this.detailsModalVisible = false;
                this.$notification['success']({
                    message: 'Kick out tài khoản thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Kick out tài khoản không thành công'
                });
            }
        },
        onSwap() {
            this.$refs.changeForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.changeForm);
                    await this.swapKhachHang(this.changeForm);
                    await this.getData();
                    this.changeModalVisible = false;
                    this.$notification['success']({
                        message: 'Đổi tài khoản thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Đổi tài khoản không thành công'
                    });
                }
            });
        },
        async onDelete(item) {
            try {
                await this.deleteKhachHang(item.id);
                await this.getData();
                this.detailsModalVisible = false;
                this.$notification['success']({
                    message: 'Xoá tài khoản thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá tài khoản không thành công'
                });
            }
        }
    },
    async mounted() {
        await this.getListNhomKhachHang();
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.width < 1682 ? columns2 : columns1;
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
