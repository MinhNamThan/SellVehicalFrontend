<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-page-header
            class="p-0"
            :style="{ marginBottom: modifiable ? '18px' : '8px' }"
            @back="resetDonHang"
        >
            <template slot="title">
                <span :style="Object.keys(donHang).length === 0 ? { marginLeft: '-16px' } : {}">{{
                    Object.keys(donHang).length === 0
                        ? 'Danh sách đơn hàng'
                        : donHang.id
                        ? 'Thông tin đơn hàng'
                        : 'Thêm đơn hàng'
                }}</span>
            </template>
            <template slot="backIcon">
                <a-tooltip title="Quay lại" v-if="Object.keys(donHang).length !== 0">
                    <a-button
                        icon="left"
                        type="link"
                        :style="{ marginTop: '-8px', marginLeft: '-11px', marginRight: '-15px' }"
                    />
                </a-tooltip>
                <span v-else></span>
            </template>
            <template slot="extra" v-if="modifiable && Object.keys(donHang).length === 0">
                <a-button icon="plus" type="primary" @click="addDonHang">Thêm đơn hàng</a-button>
            </template>
        </a-page-header>
        <div v-if="Object.keys(donHang).length !== 0">
            <chi-tiet-don-hang />
        </div>
        <div v-else>
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
                            ref="searchInput"
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
                :dataSource="listDonHang"
                :pagination="pagination"
                @change="handleTableChange"
                :scroll="width < 1280 ? { x: 1000, y: height * 0.636 } : { y: height * 0.636 }"
            >
                <template slot="stt" slot-scope="text, record, index">
                    {{ getIndex(index) }}
                </template>
                <template slot="agent" slot-scope="text, record">
                    {{ record.user.agent && record.user.agent.name }}
                </template>
                <template slot="status" slot-scope="text">
                    <a-tag :color="getTagColor(text)" class="m-0">
                        {{ getStatus(text) }}
                    </a-tag>
                </template>
                <template slot="customer" slot-scope="text, record">
                    {{ record.khachHang.name }}
                </template>
                <template slot="date" slot-scope="text">
                    {{ moment(text).format('DD/MM/YYYY') }}
                </template>
                <template slot="sum" slot-scope="record">
                    {{ parseInt(getSum(record).toFixed()).toLocaleString() }}
                </template>
                <template slot="action" slot-scope="text, record">
                    <a-tooltip title="Cập nhật trạng thái">
                        <a-button
                            shape="circle"
                            icon="bars"
                            class="mr-2"
                            type="primary"
                            @click.stop="showModal(record)"
                        />
                    </a-tooltip>
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn xoá báo giá này không?"
                        @confirm="onDelete(record.id)"
                    >
                        <a-tooltip title="Xóa">
                            <a-button shape="circle" icon="delete" type="danger" @click.stop />
                        </a-tooltip>
                    </a-popconfirm>
                </template>
                <div
                    slot="statusFilterDropdown"
                    slot-scope="{ confirm }"
                    style="padding: 12px 6px 13px 12px"
                >
                    <a-checkbox-group v-model="selectedStatuses">
                        <a-row :gutter="[0, 5]" style="padding-bottom: 10px">
                            <a-col v-for="(status, index) in statuses" :key="index">
                                <a-checkbox :value="status.value">{{ status.name }}</a-checkbox>
                            </a-col>
                        </a-row>
                        <a-space :size="10">
                            <a-button
                                type="primary"
                                icon="filter"
                                size="small"
                                class="px-2"
                                style="width: 69px"
                                @click="() => filterStatus(confirm)"
                            >
                                Lọc
                            </a-button>
                            <a-button
                                type="danger"
                                icon="undo"
                                size="small"
                                style="width: 79px"
                                @click="() => resetStatusFilter(confirm)"
                            >
                                Reset
                            </a-button>
                        </a-space>
                    </a-checkbox-group>
                </div>
                <div
                    slot="dateFilterDropdown"
                    slot-scope="{ confirm }"
                    style="padding: 12px 13px 12px 12px"
                >
                    <div style="padding-bottom: 12px">
                        <p class="mb-1">Từ :</p>
                        <a-date-picker
                            v-model="selectedDateRange[0]"
                            :disabled-date="disabledStartDate"
                            format="DD/MM/YYYY"
                            placeholder=""
                            size="small"
                            style="width: 158px"
                            @change="
                                (date) => {
                                    if (date) selectedDateRange[0] = date.startOf('day');
                                }
                            "
                        />
                        <p class="my-1">Đến :</p>
                        <a-date-picker
                            v-model="selectedDateRange[1]"
                            :disabled-date="disabledEndDate"
                            format="DD/MM/YYYY"
                            placeholder=""
                            size="small"
                            style="width: 158px"
                            @change="
                                (date) => {
                                    if (date) selectedDateRange[1] = date.endOf('day');
                                }
                            "
                        />
                    </div>
                    <a-space :size="10">
                        <a-button
                            type="primary"
                            icon="filter"
                            size="small"
                            class="px-2"
                            style="width: 69px"
                            @click="() => filterDateRange(confirm)"
                        >
                            Lọc
                        </a-button>
                        <a-button
                            type="danger"
                            icon="undo"
                            size="small"
                            style="width: 79px"
                            @click="() => resetDateRangeFilter(confirm)"
                        >
                            Reset
                        </a-button>
                    </a-space>
                </div>
                <a-icon
                    slot="filterIcon"
                    slot-scope="filtered, column"
                    type="filter"
                    theme="filled"
                    :style="{ color: isFiltered(column.title) ? '#108ee9' : undefined }"
                ></a-icon>
            </a-table>
        </div>

        <a-modal v-model="modalVisible" destroyOnClose :width="860">
            <template slot="title">
                <h1 class="title m-0">Cập nhật trạng thái</h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                class="form"
                :model="form"
                :rules="formRules"
                ref="form"
            >
                <a-form-model-item label="Trạng thái" prop="status">
                    <a-row type="flex" justify="center">
                        <a-col>
                            <a-radio-group v-model="form.status" button-style="solid">
                                <a-radio-button
                                    v-for="(status, index) in statuses"
                                    :key="index"
                                    :value="status.value"
                                >
                                    {{ status.name }}
                                </a-radio-button>
                            </a-radio-group>
                        </a-col>
                    </a-row>
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideModal">Huỷ</a-button>
                    <a-button type="primary" @click="updateStatus">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import moment from 'moment';
import { ReactiveProvideMixin } from 'vue-reactive-provide';
import { columns1, columns2, pagination, statuses, formRules } from './const';
import { mapActions, mapGetters, mapState } from 'vuex';
import ChiTietDonHang from './ChiTietDonHang';
import { trimObject } from '../../../utils/formUtil';
export default {
    components: {
        ChiTietDonHang
    },
    mixins: [
        ReactiveProvideMixin({
            name: 'permission',
            include: ['modifiable']
        })
    ],
    data() {
        return {
            modifiable: false,
            search: '',
            pagination,
            columns: null,
            statuses,
            form: {},
            formRules,
            selectedStatuses: [],
            selectedDateRange: [],
            filteredStatuses: [],
            filteredDateRange: [],
            modalVisible: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('donHang', ['listDonHang', 'donHang', 'metadata']),
        ...mapState('daiLy', ['listDaiLy']),
        ...mapGetters('account', ['user', 'permissions'])
    },
    watch: {
        width(newVal) {
            this.columns = this.modifiable
                ? newVal < 1642
                    ? columns2
                    : columns1
                : newVal < 1642
                ? columns2.slice(0, -1)
                : columns1.slice(0, -1);
            this.setSelectedFilter();
        },
        async donHang(newVal) {
            if (Object.keys(newVal).length === 0) await this.getData();
        },
        filteredStatuses() {
            this.getData();
        },
        filteredDateRange() {
            this.getData();
        }
    },
    methods: {
        moment,
        ...mapActions('donHang', [
            'getListDonHang',
            'deleteDonHang',
            'resetDonHang',
            'selectDonHang',
            'updateDonHang'
        ]),
        ...mapActions('daiLy', ['getFullListDaiLy']),
        async getData() {
            await this.getListDonHang({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                search: this.search,
                status: this.filteredStatuses.join(','),
                from: this.filteredDateRange[0] ? this.filteredDateRange[0].toISOString() : '',
                to: this.filteredDateRange[1] ? this.filteredDateRange[1].toISOString() : ''
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
        async handleTableChange() {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            await this.getData();
        },
        getTagColor(status) {
            return statuses.find((item) => item.value === status).color;
        },
        getStatus(status) {
            return statuses.find((item) => item.value === status).name;
        },
        getSum(donHang) {
            let tongGiaThietBi = 0;
            donHang.items.forEach((item) => {
                tongGiaThietBi +=
                    item.giaBanLe * item.soLuong -
                    (item.chietKhau.unit === 'VND'
                        ? item.chietKhau.value
                        : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
            });
            const chietKhau = donHang.chietKhau;
            const tongSauChietKhau =
                tongGiaThietBi -
                (chietKhau.unit === 'VND'
                    ? chietKhau.value
                    : tongGiaThietBi * (chietKhau.value / 100));
            const phiLapDat = donHang.phiLapDat;
            const tongThanhToan =
                tongSauChietKhau +
                (phiLapDat.unit === 'VND'
                    ? phiLapDat.value
                    : tongGiaThietBi * (phiLapDat.value / 100));

            return tongThanhToan;
        },
        filterStatus(confirm) {
            confirm();
            this.filteredStatuses = [...this.selectedStatuses];
        },
        filterDateRange(confirm) {
            confirm();
            this.filteredDateRange = [...this.selectedDateRange];
        },
        resetStatusFilter(confirm) {
            confirm();
            this.selectedStatuses = [];
            this.filteredStatuses = [];
        },
        resetDateRangeFilter(confirm) {
            confirm();
            this.selectedDateRange = [];
            this.filteredDateRange = [];
        },
        disabledStartDate(startValue) {
            const endValue = this.selectedDateRange[1];
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disabledEndDate(endValue) {
            const startValue = this.selectedDateRange[0];
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        isFiltered(title) {
            switch (title) {
                case 'Trạng thái':
                    return this.filteredStatuses.length > 0;
                case 'Ngày cập nhật':
                    return this.filteredDateRange[0] || this.filteredDateRange[1];
            }
        },
        setSelectedFilter() {
            this.columns[3].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedStatuses = [...this.filteredStatuses];
                }
            };
            this.columns[5].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedDateRange = [...this.filteredDateRange];
                }
            };
        },
        rowClassName: () => 'clickable-row',
        customRow(record) {
            return {
                on: {
                    click: () => {
                        this.selectDonHang(record);
                    }
                }
            };
        },
        onSearch(value) {
            this.search = value;
            this.pagination.current = 1;
        },
        showModal(item) {
            this.form = JSON.parse(JSON.stringify(item));
            this.modalVisible = true;
        },
        hideModal() {
            this.modalVisible = false;
        },
        updateStatus() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.form);
                    await this.updateDonHang(this.form);
                    await this.getData();
                    this.modalVisible = false;
                    this.$notification['success']({
                        message: 'Cập nhật trạng thái thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật trạng thái không thành công'
                    });
                }
            });
        },
        async onDelete(id) {
            try {
                await this.deleteDonHang(id);
                await this.getData();
                this.$notification['success']({
                    message: 'Xoá báo giá thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá báo giá không thành công'
                });
            }
        },
        addDonHang() {
            const donHang = {
                userId: this.user.id,
                user: this.user,
                khachHangId: null,
                khachHang: {},
                items: [],
                chietKhau: {
                    value: 0,
                    unit: '%'
                },
                phiLapDat: {
                    value: 0,
                    unit: '%'
                },
                status: 'ORDERED',
                created: moment()
            };
            this.selectDonHang(donHang);
        }
    },
    async mounted() {
        this.resetDonHang();
        await this.getData();
        await this.getFullListDaiLy();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable
            ? this.width < 1642
                ? columns2
                : columns1
            : this.width < 1642
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
