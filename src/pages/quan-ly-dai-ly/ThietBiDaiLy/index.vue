<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách thiết bị đại lý</h1>
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
                    Thêm thiết bị
                </a-button>
            </a-col>
        </a-row>

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
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="mac" slot-scope="text">
                {{ getMacAddress(text) }}
            </template>
            <template slot="platform" slot-scope="text, record">
                {{ record.device ? record.device.platform : null }}
            </template>
            <template slot="home" slot-scope="text, record">
                {{ record.device && record.device.home ? record.device.home.name : null }}
            </template>
            <template slot="name" slot-scope="text, record">
                {{ record.device && record.device.user ? record.device.user.name : null }}
            </template>
            <template slot="email" slot-scope="text, record">
                {{ record.device && record.device.user ? record.device.user.email : null }}
            </template>
            <template slot="version" slot-scope="text, record">
                {{ record.device && record.device.data ? record.device.data.version : null }}
            </template>
            <template slot="ip" slot-scope="text, record">
                {{ record.device && record.device.data ? record.device.data.ip : null }}
            </template>
            <template slot="tunnel" slot-scope="text, record">
                {{
                    record.device && record.device.platform === 'Home Assistant'
                        ? record.device.data.tunnel_url
                        : null
                }}
            </template>
            <template slot="agent" slot-scope="text, record">
                {{ record.agent ? record.agent.name : null }}
            </template>
            <template slot="status" slot-scope="text, record">
                <a-tag :color="record.device ? '#28a745' : '#fa832d'" class="m-0">
                    {{ record.device ? 'Kích hoạt' : 'Chưa kích hoạt' }}
                </a-tag>
            </template>
            <template slot="action" slot-scope="text, record">
                <a-popconfirm
                    title="Bạn có chắc chắn muốn xoá thiết bị này không?"
                    @confirm="onDelete(record)"
                >
                    <a-tooltip title="Xoá thiết bị">
                        <a-button shape="circle" icon="delete" type="danger" @click.stop />
                    </a-tooltip>
                </a-popconfirm>
            </template>
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
                <a-descriptions-item label="Đại lý">
                    {{ form.agent ? form.agent.name : null }}
                </a-descriptions-item>
                <a-descriptions-item label="Trạng thái">
                    <a-tag :color="form.activated ? '#28a745' : '#fa832d'">
                        {{ form.activated ? 'Kích hoạt' : 'Chưa kích hoạt' }}
                    </a-tag>
                </a-descriptions-item>
            </a-descriptions>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <div
                        v-if="
                            (width >= 562 && form.platform === 'Home Assistant') ||
                            (width >= 439 && form.platform !== 'Home Assistant')
                        "
                    >
                        <div class="float-left" v-if="form.activated">
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
                        <a-row
                            class="mb-3"
                            type="flex"
                            justify="center"
                            :gutter="[10, 10]"
                            v-if="form.activated"
                        >
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
                        <a-row type="flex" justify="center">
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
                <a-descriptions-item label="/etc/mxha/info.json">
                    {{
                        `{ "group_id": "${form.userId}", "gateway_id": "${form.id}", "key": "${form.key}" }`
                    }}
                </a-descriptions-item>
            </a-descriptions>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideDetailModal">Đóng</a-button>
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

        <a-modal v-model="showAddDevice" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Thêm thiết bị</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="addForm"
                :rules="macFormRules"
                ref="addMacForm"
            >
                <a-form-model-item label="Địa chỉ MAC" prop="mac">
                    <a-input v-model="addForm.mac" />
                </a-form-model-item>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideAddModal">Hủy</a-button>
                    <a-button type="primary" @click="onAddNewMac">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import apiService from '@/services/thiet-bi-dai-ly';
import cloneDeep from 'lodash.clonedeep';
import moment from 'moment';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import { getDeviceDetail, getMacAddress, getMacFormRules } from '../../../utils/gatewayUtil';
import DanhSachThietBiCon from '../../quan-ly-thiet-bi/ThietBi/DanhSachThietBi/DanhSachThietBiCon/index.vue';
import { columns1, columns2, pagination, tunnelFormRules, tunnels } from './const';

export default {
    name: 'DanhSachThietBi',
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
            tunnelModalVisible: false,
            showAddDevice: false,
            thietBiId: null,
            form: {},
            macFormRules: {
                mac: getMacFormRules()
            },
            tunnelForm: {},
            tunnelFormRules,
            tunnels,
            deviceDetail: {},
            addForm: {
                mac: null
            },
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('thietBiDaiLy', ['agentDevice', 'metadata']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            let clone = cloneDeep(this.agentDevice);
            clone = clone.map((item) => {
                if (
                    item.device &&
                    item.device.platform === 'Home Assistant' &&
                    !item.device.data.tunnel_url
                )
                    item.device.data.tunnel_url = 'javisco.com';
                return item;
            });
            return clone;
        }
    },
    watch: {
        width(newVal) {
            this.columns = this.modifiable
                ? newVal < 1787
                    ? columns2
                    : columns1
                : newVal < 1787
                ? columns2.slice(0, -1)
                : columns1.slice(0, -1);
        }
    },
    methods: {
        moment,
        ...mapActions('thietBiDaiLy', ['saveDevice', 'getAgentDevice', 'deleteDevice']),
        ...mapActions('thietBi', ['updateThietBi']),
        getMacAddress,
        async getData() {
            await this.getAgentDevice({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                mac: this.search.mac,
                name: this.search.name,
                email: this.search.email
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
        showAddModal() {
            this.addForm = {};
            this.showAddDevice = true;
        },
        showInfoModal(record) {
            this.form = JSON.parse(
                JSON.stringify({
                    ...record.device,
                    mac: getMacAddress(record.mac),
                    agent: record.agent,
                    activated: record.device ? true : false
                })
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
        showTunnelModal() {
            this.tunnelForm = JSON.parse(JSON.stringify(this.form));
            this.tunnelModalVisible = true;
        },
        hideAddModal() {
            this.showAddDevice = false;
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
        hideTunnelModal() {
            this.tunnelModalVisible = false;
        },
        async checkMac() {
            const { data } = await apiService.getAgentDevice({
                per: 50,
                page: 1,
                mac: this.addForm.mac.trim(),
                name: '',
                email: ''
            });
            const thietBi = data.items.find(
                (item) => getMacAddress(item.mac) === this.addForm.mac.trim()
            );
            return thietBi;
        },
        onSearch() {
            trimObject(this.search);
            this.pagination.current = 1;
            this.getData();
        },
        async onAddNewMac() {
            this.$refs.addMacForm.validate(async (valid) => {
                if (!valid) return;

                const thietBi = await this.checkMac();
                if (thietBi) {
                    this.$notification['error']({
                        message: 'Địa chỉ MAC này đã tồn tại trong hệ thống'
                    });
                    return;
                }

                try {
                    trimObject(this.addForm);
                    await this.saveDevice(this.addForm);
                    await this.getData();
                    this.showAddDevice = false;
                    this.$notification['success']({
                        message: 'Thêm thiết bị thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Thêm thiết bị không thành công'
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
        async onDelete(record) {
            try {
                await this.deleteDevice(record.id);
                await this.getData();
                this.$notification['success']({
                    message: 'Xoá thiết bị thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá thiết bị không thành công'
                });
            }
        }
    },
    async mounted() {
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable
            ? this.width < 1787
                ? columns2
                : columns1
            : this.width < 1787
            ? columns2.slice(0, -1)
            : columns1.slice(0, -1);
    }
};
</script>
