<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-page-header
            class="p-0"
            :style="{ marginBottom: modifiable ? '18px' : '8px' }"
            @back="returnBaoGia"
        >
            <template slot="title">
                <span :style="Object.keys(baoGia).length === 0 ? { marginLeft: '-16px' } : {}">{{
                    Object.keys(baoGia).length === 0
                        ? 'Danh sách báo giá'
                        : baoGia.id
                        ? 'Thông tin báo giá'
                        : 'Thêm báo giá'
                }}</span>
            </template>
            <template slot="backIcon">
                <a-tooltip title="Quay lại" v-if="Object.keys(baoGia).length !== 0">
                    <a-button
                        icon="left"
                        type="link"
                        :style="{ marginTop: '-8px', marginLeft: '-11px', marginRight: '-15px' }"
                    />
                </a-tooltip>
                <span v-else></span>
            </template>
            <template slot="extra" v-if="modifiable && Object.keys(baoGia).length === 0">
                <a-button icon="plus" type="primary" @click="addBaoGia">Thêm báo giá</a-button>
            </template>
        </a-page-header>

        <div v-if="Object.keys(baoGia).length !== 0">
            <ChiTietBaoGia />
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
                            v-model="search"
                            @search="getData"
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
                :dataSource="listBaoGia"
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
                <template slot="owner" slot-scope="text, record">
                    {{ record.user && record.user.name }}
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
                <template slot="sum" slot-scope="text, record">
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
                    slot="agentFilterDropdown"
                    slot-scope="{ confirm }"
                    style="padding: 12px 6px 13px 12px"
                >
                    <a-checkbox-group @change="onChangeCheckedAgent" ref="checkedAgent">
                        <a-input-search
                            ref="searchInput"
                            placeholder="Nhập tên đại lý"
                            class="input-search-agent"
                            v-model="searchAgent"
                            allowClear
                        />
                        <a-row :gutter="[0, 5]" style="padding-bottom: 10px">
                            <a-col v-for="agent in agents" :key="agent.id">
                                <a-checkbox :value="agent.id">{{ agent.name }}</a-checkbox>
                            </a-col>
                        </a-row>
                        <a-space :size="10">
                            <a-button
                                type="primary"
                                icon="filter"
                                size="small"
                                class="px-2"
                                style="width: 69px"
                                @click="() => filterAgent(confirm)"
                            >
                                Lọc
                            </a-button>
                            <a-button
                                type="danger"
                                icon="undo"
                                size="small"
                                style="width: 79px"
                                @click="() => resetAgentFilter(confirm)"
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
                />
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
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import ChiTietBaoGia from './ChiTietBaoGia';
import { columns1, columns2, formRules, pagination, statuses } from './const';
import { Modal } from 'ant-design-vue';
import _ from 'lodash';
import { isSubstring } from '@/utils/stringUtil';

export default {
    name: 'BaoGia',
    components: { ChiTietBaoGia },
    mixins: [
        ReactiveProvideMixin({
            name: 'permission',
            include: ['modifiable']
        })
    ],
    data() {
        return {
            columns: null,
            pagination,
            search: '',
            form: {},
            formRules,
            modalVisible: false,
            statuses,
            modifiable: false,
            selectedAgents: [],
            selectedStatuses: [],
            selectedDateRange: [],
            filteredAgents: [],
            filteredStatuses: [],
            filteredDateRange: [],
            searchAgent: ''
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('daiLy', ['listDaiLy']),
        ...mapState('baoGia', ['listBaoGia', 'baoGia', 'metadata', 'baoGiaSaved']),
        ...mapGetters('account', ['user', 'permissions']),
        agents() {
            return this.listDaiLy.filter((item) =>
                typeof item.name === 'string' ? isSubstring(this.searchAgent, item.name) : false
            );
        }
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
        async baoGia(newVal) {
            if (Object.keys(newVal).length === 0) await this.getData();
        },
        filteredStatuses() {
            this.getData();
        },
        filteredDateRange() {
            this.getData();
        },
        filteredAgents() {
            this.getData();
        },
        searchAgent() {
            if (this.searchAgent == '') this.selectedAgents = this.$refs.checkedAgent.sValue;
        }
    },
    methods: {
        moment,
        ...mapActions('baoGia', [
            'updateBaoGia',
            'getListBaoGia',
            'deleteBaoGia',
            'selectBaoGia',
            'resetBaoGia',
            'addPhong',
            'resetBaoGiaSaved',
            'selectBaoGiaSaved'
        ]),
        ...mapActions('daiLy', ['getFullListDaiLy']),
        async getData() {
            await this.getListBaoGia({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                search: this.search,
                agentId: this.filteredAgents.join(','),
                status: this.filteredStatuses.join(','),
                from: this.filteredDateRange[0] ? this.filteredDateRange[0].toISOString() : '',
                to: this.filteredDateRange[1] ? this.filteredDateRange[1].toISOString() : ''
            });
            this.pagination.total = this.metadata.total;
            await this.getFullListDaiLy();
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
        getTagColor(status) {
            return statuses.find((item) => item.value === status).color;
        },
        getStatus(status) {
            return statuses.find((item) => item.value === status).name;
        },
        getSum(baoGia) {
            let tongGiaThietBi = 0;
            baoGia.items.forEach((i) => {
                i.listSanPham.forEach((item) => {
                    tongGiaThietBi +=
                        item.giaBanLe * item.soLuong -
                        (item.chietKhau.unit === 'VND'
                            ? item.chietKhau.value
                            : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
                });
            });
            const chietKhau = baoGia.chietKhau;
            const tongSauChietKhau =
                tongGiaThietBi -
                (chietKhau.unit === 'VND'
                    ? chietKhau.value
                    : tongGiaThietBi * (chietKhau.value / 100));
            const phiLapDat = baoGia.phiLapDat;
            const tongThanhToan =
                tongSauChietKhau +
                (phiLapDat.unit === 'VND'
                    ? phiLapDat.value
                    : tongGiaThietBi * (phiLapDat.value / 100));

            return tongThanhToan;
        },
        async handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            await this.getData();
        },
        rowClassName: () => 'clickable-row',
        customRow(record) {
            return {
                on: {
                    click: () => {
                        this.selectBaoGia(record);
                        this.selectBaoGiaSaved(record);
                    }
                }
            };
        },
        showModal(item) {
            this.form = JSON.parse(JSON.stringify(item));
            this.modalVisible = true;
        },
        hideModal() {
            this.modalVisible = false;
        },
        addBaoGia() {
            const baoGia = {
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
                status: 'DRAFT',
                created: moment()
            };
            this.selectBaoGia(baoGia);
            this.selectBaoGiaSaved(baoGia);
            this.addPhong();
        },
        updateStatus() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.form);
                    await this.updateBaoGia(this.form);
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
                await this.deleteBaoGia(id);
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
        filterStatus(confirm) {
            confirm();
            this.filteredStatuses = [...this.selectedStatuses];
        },
        filterAgent(confirm) {
            confirm();
            this.filteredAgents = [...this.selectedAgents];
        },
        filterDateRange(confirm) {
            confirm();
            this.filteredDateRange = [...this.selectedDateRange];
        },
        resetAgentFilter(confirm) {
            confirm();
            this.selectedAgents = [];
            this.filteredAgents = [];
            this.$refs.checkedAgent.sValue = [];
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
        isFiltered(title) {
            switch (title) {
                case 'Đại lý':
                    return this.filteredAgents.length > 0;
                case 'Trạng thái':
                    return this.filteredStatuses.length > 0;
                case 'Ngày cập nhật':
                    return this.filteredDateRange[0] || this.filteredDateRange[1];
            }
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
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        setSelectedFilter() {
            this.columns[2].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedAgents = [...this.filteredAgents];
                }
            };
            this.columns[4].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedStatuses = [...this.filteredStatuses];
                }
            };
            this.columns[6].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedDateRange = [...this.filteredDateRange];
                }
            };
        },
        async returnBaoGia() {
            const self = this;
            let baoGia = await self.baoGia;
            let baoGiaSaved = await self.baoGiaSaved;
            delete baoGia.createdAt;
            delete baoGia.updatedAt;
            delete baoGia.expiredTime;
            delete baoGiaSaved.createdAt;
            delete baoGiaSaved.updatedAt;
            delete baoGiaSaved.expiredTime;
            if (!baoGiaSaved.id || !_.isEqual(baoGia, baoGiaSaved)) {
                Modal.confirm({
                    title: 'Chưa lưu báo giá?',
                    content: 'Bạn có chắc muốn rời đi',
                    onOk() {
                        self.resetBaoGia();
                        self.resetBaoGiaSaved();
                    },
                    onCancel() {
                        return;
                    },
                    class: 'test'
                });
            } else {
                self.resetBaoGia();
                self.resetBaoGiaSaved();
            }
        },
        onChangeCheckedAgent(checkedValues) {
            this.selectedAgents = checkedValues;
        }
    },
    mounted() {
        this.resetBaoGia();
        this.resetBaoGiaSaved();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable
            ? this.width < 1642
                ? columns2
                : columns1
            : this.width < 1642
            ? columns2.slice(0, -1)
            : columns1.slice(0, -1);
        this.setSelectedFilter();
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
