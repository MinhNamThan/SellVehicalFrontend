<template>
    <div :style="khachHangEmail ? { marginTop: '-12px' } : null">
        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <p>{{ getStatistics() }}</p>
            </a-col>
            <a-col :xs="24" :sm="24" :md="16">
                <div
                    class="float-md-right"
                    :style="{
                        marginTop: '-8px'
                    }"
                    v-if="!khachHangEmail"
                >
                    <a-space align="start" class="d-flex flex-column flex-md-row">
                        <a-input
                            class="mb-2 mb-md-0"
                            v-model="search.mac"
                            placeholder="Địa chỉ MAC"
                            @pressEnter="onSearch"
                            allowClear
                        />
                        <a-input
                            class="mb-2 mb-md-0"
                            v-model="search.name"
                            placeholder="Tên khách hàng"
                            @pressEnter="onSearch"
                            allowClear
                        />
                        <a-input
                            class="mb-2 mb-md-0"
                            v-model="search.email"
                            placeholder="Email"
                            @pressEnter="onSearch"
                            allowClear
                        />
                        <a-button type="primary" @click="onSearch" class="mb-2 mb-md-0"
                            >Tìm kiếm</a-button
                        >
                    </a-space>
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
            :scroll="
                khachHangEmail
                    ? { y: height * 0.52 }
                    : width < 1280
                    ? { x: 1000, y: height * 0.64 }
                    : { y: height * 0.64 }
            "
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="mac" slot-scope="text, record">
                {{ getMacAddress(record.deviceId) }}
            </template>
            <template slot="home" slot-scope="text">
                {{ text ? text.name : null }}
            </template>
            <template slot="name" slot-scope="text, record">
                {{ record.user ? record.user.name : null }}
            </template>
            <template slot="email" slot-scope="text, record">
                {{ record.user ? record.user.email : null }}
            </template>
            <template slot="version" slot-scope="text, record">
                {{ record.data ? record.data.version : null }}
            </template>
            <template slot="ip" slot-scope="text, record">
                {{ record.data ? record.data.ip : null }}
            </template>
            <template slot="tunnel" slot-scope="text, record">
                {{ record.platform === 'Home Assistant' ? record.data.tunnel_url : null }}
            </template>
            <template slot="status" slot-scope="text, record">
                <a-tag :color="record.online ? '#28a745' : '#fa832d'" class="m-0">
                    {{ record.online ? 'Trực tuyến' : 'Ngoại tuyến' }}
                </a-tag>
            </template>

            <div
                slot="modelFilterDropdown"
                slot-scope="{ confirm }"
                style="padding: 12px 6px 13px 12px"
            >
                <a-checkbox-group v-model="selectedModels">
                    <a-row :gutter="[0, 5]" style="padding-bottom: 10px">
                        <a-col v-for="(model, index) in models" :key="index">
                            <a-checkbox :value="model">{{ model }}</a-checkbox>
                        </a-col>
                    </a-row>
                    <a-space :size="10">
                        <a-button
                            type="primary"
                            icon="filter"
                            size="small"
                            class="px-2"
                            style="width: 66px"
                            @click="() => filterModel(confirm)"
                        >
                            Lọc
                        </a-button>
                        <a-button
                            type="danger"
                            icon="undo"
                            size="small"
                            style="width: 76px"
                            @click="() => resetModelFilter(confirm)"
                        >
                            Reset
                        </a-button>
                    </a-space>
                </a-checkbox-group>
            </div>
            <div
                slot="tunnelFilterDropdown"
                slot-scope="{ confirm }"
                style="padding: 12px 13px 12px 12px"
            >
                <a-checkbox-group v-model="selectedTunnels">
                    <a-row :gutter="[0, 6]" style="padding-bottom: 10px">
                        <a-col v-for="(tunnel, index) in tunnels" :key="index">
                            <a-checkbox :value="tunnel">{{ tunnel }}</a-checkbox>
                        </a-col>
                    </a-row>
                    <a-space :size="10">
                        <a-button
                            type="primary"
                            icon="filter"
                            size="small"
                            class="px-2"
                            style="width: 65px"
                            @click="() => filterTunnel(confirm)"
                        >
                            Lọc
                        </a-button>
                        <a-button
                            type="danger"
                            icon="undo"
                            size="small"
                            style="width: 75px"
                            @click="() => resetTunnelFilter(confirm)"
                        >
                            Reset
                        </a-button>
                    </a-space>
                </a-checkbox-group>
            </div>
            <div
                slot="statusFilterDropdown"
                slot-scope="{ confirm }"
                style="padding: 12px 13px 12px 12px"
            >
                <a-checkbox-group v-model="selectedStatuses">
                    <a-row :gutter="[0, 5]" style="padding-bottom: 10px">
                        <a-col>
                            <a-checkbox :value="true">Trực tuyến</a-checkbox>
                        </a-col>
                        <a-col>
                            <a-checkbox :value="false">Ngoại tuyến</a-checkbox>
                        </a-col>
                    </a-row>
                    <a-space :size="10">
                        <a-button
                            type="primary"
                            icon="filter"
                            size="small"
                            class="px-2"
                            style="width: 65px"
                            @click="() => filterStatus(confirm)"
                        >
                            Lọc
                        </a-button>
                        <a-button
                            type="danger"
                            icon="undo"
                            size="small"
                            style="width: 75px"
                            @click="() => resetStatusFilter(confirm)"
                        >
                            Reset
                        </a-button>
                    </a-space>
                </a-checkbox-group>
            </div>
            <a-icon
                slot="filterIcon"
                slot-scope="filtered, column"
                type="filter"
                theme="filled"
                :style="{ color: isFiltered(column.title) ? '#108ee9' : undefined }"
            />
        </a-table>

        <a-modal v-model="infoModalVisible" destroyOnClose :width="width < 1000 ? null : 1000">
            <template slot="title">
                <h1 class="title m-0">Thông tin thiết bị</h1>
            </template>

            <a-descriptions
                :column="width < 630 ? 1 : 2"
                :layout="width < 420 ? 'vertical' : 'horizontal'"
                bordered
            >
                <a-descriptions-item label="Địa chỉ MAC">
                    {{ form.mac }}
                </a-descriptions-item>
                <a-descriptions-item label="Phiên bản">
                    {{ form.data && form.data.version ? form.data.version : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Model">
                    {{ form.platform }}
                </a-descriptions-item>
                <a-descriptions-item label="IP nội mạng">
                    {{ form.data && form.data.ip ? form.data.ip : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Nhà">
                    {{ form.home ? form.home.name : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Phiên bản tunnel">
                    {{ form.platform === 'Home Assistant' ? form.data.tunnel_url : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Tên khách hàng">
                    {{ form.user ? form.user.name : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Ngày đăng ký">
                    {{ form.createdAt ? moment(form.createdAt).format('DD/MM/YYYY') : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Email">
                    {{ form.user ? form.user.email : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Ngày cập nhật">
                    {{ form.updatedAt ? moment(form.updatedAt).format('DD/MM/YYYY') : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Trạng thái">
                    <a-tag :color="form.online ? '#28a745' : '#fa832d'">
                        {{ form.online ? 'Trực tuyến' : 'Ngoại tuyến' }}
                    </a-tag>
                </a-descriptions-item>
            </a-descriptions>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <div
                        v-if="
                            (width >= 733 && form.platform === 'Home Assistant') ||
                            (width >= 589 && form.platform !== 'Home Assistant')
                        "
                    >
                        <div class="float-left">
                            <a-button
                                icon="profile"
                                type="link"
                                class="btn bg-purple px-2"
                                @click="showDeviceModal"
                            >
                                Danh sách thực thể
                            </a-button>
                            <a-button
                                icon="bug"
                                type="primary"
                                class="px-2"
                                @click="showDetailModal"
                            >
                                Hỗ trợ kỹ thuật
                            </a-button>
                            <a-button
                                icon="form"
                                type="link"
                                class="btn bg-green px-2"
                                @click="showMacModal"
                                v-if="modifiable"
                            >
                                Sửa địa chỉ MAC
                            </a-button>
                            <a-button
                                icon="filter"
                                type="link"
                                class="btn bg-orange px-2"
                                @click="showTunnelModal"
                                v-if="modifiable && form.platform === 'Home Assistant'"
                            >
                                Thay đổi tunnel
                            </a-button>
                        </div>
                        <a-button @click="hideInfoModal">Đóng</a-button>
                    </div>
                    <div v-else>
                        <a-row type="flex" justify="center" :gutter="[10, 10]">
                            <a-col>
                                <a-button
                                    icon="profile"
                                    type="link"
                                    class="btn bg-purple px-2"
                                    @click="showDeviceModal"
                                >
                                    Danh sách thực thể
                                </a-button>
                            </a-col>
                            <a-col>
                                <a-button
                                    icon="bug"
                                    type="primary"
                                    class="px-2"
                                    @click="showDetailModal"
                                >
                                    Hỗ trợ kỹ thuật
                                </a-button>
                            </a-col>
                            <a-col v-if="modifiable">
                                <a-button
                                    icon="form"
                                    type="link"
                                    class="btn bg-green px-2"
                                    @click="showMacModal"
                                >
                                    Sửa địa chỉ MAC
                                </a-button>
                            </a-col>
                            <a-col v-if="modifiable && form.platform === 'Home Assistant'">
                                <a-button
                                    icon="filter"
                                    type="link"
                                    class="btn bg-orange px-2"
                                    @click="showTunnelModal"
                                >
                                    Thay đổi tunnel
                                </a-button>
                            </a-col>
                        </a-row>
                        <a-row type="flex" justify="center" class="mt-3">
                            <a-col>
                                <a-button @click="hideInfoModal">Đóng</a-button>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="deviceModalVisible" destroyOnClose :width="width < 1200 ? null : 1200">
            <template slot="title">
                <h1 class="title m-0">Danh sách thực thể</h1>
            </template>
            <DanhSachThietBiCon :thietBiId="thietBiId" />
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideDeviceModal">Đóng</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="detailModalVisible" destroyOnClose :width="width < 1000 ? null : 1000">
            <template slot="title">
                <h1 class="title m-0">Hỗ trợ kỹ thuật</h1>
            </template>

            <a-descriptions
                :column="width < 750 ? 1 : 2"
                :layout="width < 525 ? 'vertical' : 'horizontal'"
                bordered
            >
                <a-descriptions-item label="Địa chỉ MAC thiết bị">
                    {{ deviceDetail.macAddress }}
                </a-descriptions-item>
                <a-descriptions-item label="Username (web)">
                    {{ deviceDetail.userName }}
                </a-descriptions-item>
                <a-descriptions-item label="Remote URL">
                    <a :href="deviceDetail.remoteURL" target="_blank">{{
                        deviceDetail.remoteURL
                    }}</a>
                </a-descriptions-item>
                <a-descriptions-item label="Password (web)">
                    {{ deviceDetail.password }}
                </a-descriptions-item>
                <a-descriptions-item label="SSH URL">
                    {{ deviceDetail.sshURL }}
                </a-descriptions-item>
                <a-descriptions-item label="SSH password">
                    {{ deviceDetail.sshPassword }}
                </a-descriptions-item>
                <a-descriptions-item label="SSH URL 2" :span="2">
                    {{ deviceDetail.sshURL2 }}
                </a-descriptions-item>
                <a-descriptions-item label="/etc/mxha/info.json" :span="2">
                    {{
                        `{ "group_id": "${form.userId}", "gateway_id": "${form.id}", "key": "${form.key}" }`
                    }}
                </a-descriptions-item>
            </a-descriptions>
            <a-row>
                <a-col :span="14">
                    <a-form-model-item label=""></a-form-model-item>
                    <a-form-model-item label=""></a-form-model-item>
                    <a-form-model-item label=""></a-form-model-item>
                </a-col>
                <a-col :span="10">
                    <a-form-model-item label=""></a-form-model-item>
                    <a-form-model-item label=""></a-form-model-item>
                    <a-form-model-item label=""></a-form-model-item>
                </a-col>
                <a-col :span="24">
                    <a-form-model-item label=""> </a-form-model-item>
                </a-col>
            </a-row>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideDetailModal">Đóng</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="macModalVisible" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Sửa địa chỉ MAC</h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="macForm"
                :rules="macFormRules"
                ref="macForm"
            >
                <a-form-model-item label="Địa chỉ MAC" prop="mac">
                    <a-input :style="{ width: '250px' }" v-model="macForm.mac" />
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideMacModal">Hủy</a-button>
                    <a-button type="primary" @click="onEditMac">Lưu</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="tunnelModalVisible" destroyOnClose v-if="tunnelForm.data">
            <template slot="title">
                <h1 class="title m-0">Thay đổi tunnel</h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="tunnelForm.data"
                :rules="tunnelFormRules"
                ref="tunnelForm"
            >
                <a-form-model-item label="Tunnel" prop="tunnel_url">
                    <a-radio-group v-model="tunnelForm.data.tunnel_url" buttonStyle="solid">
                        <a-radio-button
                            v-for="(tunnel, index) in tunnels"
                            :key="index"
                            :value="tunnel"
                        >
                            {{ tunnel }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideTunnelModal">Hủy</a-button>
                    <a-popconfirm placement="bottom" @confirm="onEditTunnel">
                        <template slot="title">
                            <div :style="{ paddingTop: '2px' }">
                                <div v-if="tunnelForm.data.tunnel_url === 'javisco.com'">
                                    <p>
                                        Cần kiểm tra lại các dịch vụ sau trước khi chuyển đổi:
                                        <br />
                                        1. Bản tunnel cũ vẫn chạy: có thể truy cập được vào
                                        <br />
                                        link web ứng với domain javisco.vn
                                    </p>
                                    Xác nhận chuyển đổi sang tunnel javisco.com?
                                </div>
                                <div v-if="tunnelForm.data.tunnel_url === 'javiscloud.com'">
                                    <p>
                                        Cần kiểm tra lại các dịch vụ sau trước khi chuyển đổi:
                                        <br />
                                        1. Đã cập nhật bản tunnel mới trên HC
                                        <br />
                                        2. Đã cập nhật service mx mới trên HC
                                        <br />
                                        3. Đã thiết lập đúng proxy.yaml trong thư mục packages
                                        <br />
                                        của configuration trong HC
                                    </p>
                                    Xác nhận chuyển đổi sang tunnel javiscloud.com?
                                </div>
                                <div v-if="tunnelForm.data.tunnel_url === 'javishome.io'">
                                    Xác nhận chuyển đổi sang tunnel javishome.io?
                                </div>
                            </div>
                        </template>
                        <a-button type="primary">Lưu</a-button>
                    </a-popconfirm>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import apiService from '@/services/thiet-bi';
import moment from 'moment';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../../utils/formUtil';
import {
    getDeviceDetail,
    getDeviceId,
    getMacAddress,
    getMacFormRules
} from '../../../../utils/gatewayUtil';
import DanhSachThietBiCon from './DanhSachThietBiCon';
import { columns1, columns2, models, pagination, tunnelFormRules, tunnels } from './const';

export default {
    name: 'DanhSachThietBi',
    props: ['khachHangEmail'],
    components: { DanhSachThietBiCon },
    data() {
        return {
            columns: null,
            pagination,
            search: {
                mac: '',
                name: '',
                email: ''
            },
            infoModalVisible: false,
            deviceModalVisible: false,
            detailModalVisible: false,
            macModalVisible: false,
            tunnelModalVisible: false,
            thietBiId: null,
            form: {},
            macForm: {},
            macFormRules: {
                mac: getMacFormRules()
            },
            tunnelForm: {},
            tunnelFormRules,
            tunnels,
            deviceDetail: {},
            modifiable: false,
            models,
            selectedModels: [],
            selectedTunnels: [],
            selectedStatuses: [],
            filteredModels: [],
            filteredTunnels: [],
            filteredStatuses: []
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('thietBi', ['listThietBi', 'metadata']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            return this.listThietBi.map((item) => {
                if (item.platform === 'Home Assistant' && !item.data.tunnel_url)
                    item.data.tunnel_url = 'javisco.com';
                return item;
            });
        }
    },
    watch: {
        width(newVal) {
            this.columns = newVal < 1682 ? columns2 : columns1;
            if (this.khachHangEmail) {
                this.columns = this.columns.filter((item, index) => index !== 4 && index !== 5);
            }
            this.setSelectedFilter();
        },
        filteredModels() {
            this.getData();
        },
        filteredTunnels() {
            this.getData();
        },
        filteredStatuses() {
            this.getData();
        }
    },
    methods: {
        moment,
        ...mapActions('thietBi', ['updateThietBi', 'getListThietBi']),
        getMacAddress,
        async getData() {
            await this.getListThietBi({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                mac: this.search.mac,
                name: this.search.name,
                email: this.search.email,
                platform: this.filteredModels.join(','),
                tunnel: this.filteredTunnels.join(','),
                status: this.filteredStatuses.join(',')
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
                        this.showInfoModal(record);
                    }
                }
            };
        },
        showInfoModal(record) {
            this.form = JSON.parse(
                JSON.stringify({ ...record, mac: getMacAddress(record.deviceId) })
            );
            this.infoModalVisible = true;
        },
        showDeviceModal() {
            this.thietBiId = this.form.id;
            this.deviceModalVisible = true;
        },
        showDetailModal() {
            this.deviceDetail = getDeviceDetail(this.form.mac);
            this.detailModalVisible = true;
        },
        showMacModal() {
            this.macForm = JSON.parse(JSON.stringify(this.form));
            this.macModalVisible = true;
        },
        showTunnelModal() {
            this.tunnelForm = JSON.parse(JSON.stringify(this.form));
            this.tunnelModalVisible = true;
        },
        hideInfoModal() {
            this.infoModalVisible = false;
        },
        hideDeviceModal() {
            this.deviceModalVisible = false;
        },
        hideDetailModal() {
            this.detailModalVisible = false;
        },
        hideMacModal() {
            this.macModalVisible = false;
        },
        hideTunnelModal() {
            this.tunnelModalVisible = false;
        },
        async checkMac() {
            const { data } = await apiService.getListThietBi({
                per: 50,
                page: 1,
                mac: this.macForm.mac.trim(),
                name: '',
                email: ''
            });
            const thietBi = data.items.find(
                (item) => getMacAddress(item.deviceId) === this.macForm.mac.trim()
            );
            return thietBi && thietBi.id !== this.macForm.id ? thietBi : null;
        },
        onSearch() {
            trimObject(this.search);
            this.pagination.current = 1;
            this.getData();
        },
        onEditMac() {
            this.$refs.macForm.validate(async (valid) => {
                if (!valid) return;

                const thietBi = await this.checkMac();
                if (thietBi) {
                    this.$notification['error']({
                        message: `Địa chỉ MAC ${this.macForm.mac.trim().toUpperCase()} ${
                            thietBi.user ? 'thuộc tài khoản ' + thietBi.user.email : ''
                        } đã tồn tại trong hệ thống`
                    });
                    return;
                }

                try {
                    this.macForm.deviceId = getDeviceId(this.macForm.mac);
                    trimObject(this.macForm);
                    await this.updateThietBi(this.macForm);
                    await this.getData();
                    this.form = JSON.parse(JSON.stringify(this.macForm));
                    this.macModalVisible = false;
                    this.$notification['success']({
                        message: 'Cập nhật địa chỉ MAC thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật địa chỉ MAC không thành công'
                    });
                }
            });
        },
        onEditTunnel() {
            this.$refs.tunnelForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    await this.updateThietBi(this.tunnelForm);
                    await this.getData();
                    this.form = JSON.parse(JSON.stringify(this.tunnelForm));
                    this.tunnelModalVisible = false;
                    this.$notification['success']({
                        message: `Chuyển đổi sang tunnel ${this.tunnelForm.data.tunnel_url} thành công`
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: `Chuyển đổi sang tunnel ${this.tunnelForm.data.tunnel_url} không thành công`
                    });
                }
            });
        },
        filterModel(confirm) {
            confirm();
            this.filteredModels = [...this.selectedModels];
        },
        filterTunnel(confirm) {
            confirm();
            this.filteredTunnels = [...this.selectedTunnels];
        },
        filterStatus(confirm) {
            confirm();
            this.filteredStatuses = [...this.selectedStatuses];
        },
        resetModelFilter(confirm) {
            confirm();
            this.selectedModels = [];
            this.filteredModels = [];
        },
        resetTunnelFilter(confirm) {
            confirm();
            this.selectedTunnels = [];
            this.filteredTunnels = [];
        },
        resetStatusFilter(confirm) {
            confirm();
            this.selectedStatuses = [];
            this.filteredStatuses = [];
        },
        isFiltered(title) {
            switch (title) {
                case 'Model':
                    return this.filteredModels.length > 0;
                case 'Phiên bản tunnel':
                    return this.filteredTunnels.length > 0;
                case 'Trạng thái':
                    return this.filteredStatuses.length > 0;
            }
        },
        setSelectedFilter() {
            this.columns[2].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedModels = [...this.filteredModels];
                }
            };
            this.columns[this.columns.length - 2].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedTunnels = [...this.filteredTunnels];
                }
            };
            this.columns[this.columns.length - 1].onFilterDropdownVisibleChange = (visible) => {
                if (visible) {
                    this.selectedStatuses = [...this.filteredStatuses];
                }
            };
        }
    },
    async mounted() {
        this.columns = this.width < 1682 ? columns2 : columns1;
        if (this.khachHangEmail) {
            this.search.email = this.khachHangEmail;
            this.columns = this.columns.filter((item, index) => index !== 4 && index !== 5);
        }
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.setSelectedFilter();
    }
};
</script>
