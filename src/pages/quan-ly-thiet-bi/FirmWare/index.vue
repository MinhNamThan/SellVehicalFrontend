<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách firmware</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button icon="plus" class="float-md-right" type="primary" @click="showCreateForm"
                    >Thêm firmware
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
            :rowKey="(record, index) => index"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.66 } : { y: height * 0.66 }"
            @change="handleTableChange"
        >
            <template slot="no" slot-scope="text, record, index">{{ getIndex(index) }}</template>
            <template slot="firmware_info_test" slot-scope="text, record">
                <div v-if="!checkTestNull(record)">
                    <p><strong>Phiên bản</strong>: {{ record.version_test }}</p>
                    <p><strong>Build</strong>: {{ record.build_test }}</p>
                    <p class="mb-1"><strong>Ghi chú</strong>:</p>
                    <pre class="note">{{ record.note_test }}</pre>
                </div>
            </template>
            <template slot="firmware_info" slot-scope="text, record">
                <div v-if="!checkOfficialNull(record)">
                    <p><strong>Phiên bản</strong>: {{ record.version }}</p>
                    <p><strong>Build</strong>: {{ record.build }}</p>
                    <p class="mb-1"><strong>Ghi chú</strong>:</p>
                    <pre class="note">{{ record.note }}</pre>
                </div>
            </template>
            <template slot="action" slot-scope="text, record">
                <a-space :direction="width < 1500 ? 'vertical' : 'horizontal'">
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn đưa bản thử nghiệm này lên chính thức không?"
                        @confirm="updateTestToOfficial(record)"
                    >
                        <a-tooltip title="Đưa lên chính thức">
                            <a-button
                                icon="check-circle"
                                type="link"
                                shape="circle"
                                class="btn bg-green"
                            >
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn xoá bản thử nghiệm này không?"
                        @confirm="deleteTest(record)"
                    >
                        <a-tooltip title="Xoá bản thử nghiệm">
                            <a-button
                                icon="close-circle"
                                type="link"
                                shape="circle"
                                class="btn bg-orange"
                            ></a-button>
                        </a-tooltip>
                    </a-popconfirm>
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn xoá firmware này không?"
                        @confirm="handleDeleteFirmware(record)"
                    >
                        <a-tooltip title="Xoá firmware">
                            <a-button icon="delete" type="danger" shape="circle"></a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </a-table>
        <a-modal v-model="showModal" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Thêm firmware</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="firmwareInfo"
                :rules="rules"
                ref="firmwareForm"
            >
                <a-form-model-item label="Mã phần cứng" prop="hardware">
                    <a-select
                        show-search
                        v-model="firmwareInfo.hardware"
                        :defaultActiveFirstOption="false"
                        :showArrow="false"
                        :filterOption="false"
                        :notFoundContent="null"
                        @search="searchPhanCung"
                        @focus="searchHardware = ''"
                    >
                        <a-select-option
                            v-for="(hardware, index) in filterData"
                            :key="index"
                            :value="hardware.name"
                        >
                            {{ hardware.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="Phiên bản" prop="version">
                    <a-input v-model="firmwareInfo.version" />
                </a-form-model-item>
                <a-form-model-item label="Build" prop="build">
                    <a-input-number v-model="firmwareInfo.build" :min="1" />
                </a-form-model-item>
                <a-form-model-item label="Ghi chú" prop="note">
                    <a-textarea
                        v-model="firmwareInfo.note"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                </a-form-model-item>
                <a-form-model-item label="Chọn phần cứng" prop="file">
                    <a-space v-if="firmwareInfo.file">
                        <a-icon type="file-zip" />
                        <span>
                            {{ firmwareInfo.file.name }}
                        </span>
                        <a-button
                            class="btn-delete ml-1"
                            size="small"
                            shape="circle"
                            icon="delete"
                            type="dashed"
                            @click="firmwareInfo.file = null"
                        />
                    </a-space>
                    <a-upload
                        accept=".bin"
                        :customRequest="customRequest"
                        :showUploadList="false"
                        v-else
                    >
                        <a-button> <a-icon type="upload" /> Upload </a-button>
                    </a-upload>
                </a-form-model-item>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="showModal = false">Huỷ</a-button>
                    <a-button type="primary" @click="handleOk">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import debounce from 'lodash.debounce';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import { isSubstring } from '../../../utils/stringUtil';
import { columns, pagination, rules } from './const';

export default {
    name: 'QuanLyFirmWare',
    data() {
        return {
            showModal: false,
            columns: null,
            pagination,
            search: '',
            firmwareInfo: {
                hardware: null,
                build: null,
                version: null,
                note: '',
                file: null
            },
            rules,
            searchHardware: '',
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('firmware', ['firmwareList']),
        ...mapState('phanCung', ['listPhanCung']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            return this.firmwareList.filter((item) =>
                typeof item.hardware === 'string' ? isSubstring(this.search, item.hardware) : false
            );
        },
        filterData() {
            return this.listPhanCung.filter((item) => isSubstring(this.searchHardware, item.name));
        }
    },
    watch: {
        dataSource(value) {
            this.pagination.total = value.length;
        }
    },
    methods: {
        ...mapActions('firmware', [
            'getListFirmware',
            'uploadFirmware',
            'releaseFirmware',
            'disableTestFirmware',
            'deleteFirmware'
        ]),
        ...mapActions('phanCung', ['getListPhanCung']),
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
        async handleOk() {
            this.$refs.firmwareForm.validate(async (valid) => {
                if (!valid) return;

                try {
                    trimObject(this.firmwareInfo);
                    let payload = new FormData();
                    for (let key in this.firmwareInfo) {
                        payload.append(key, this.firmwareInfo[key]);
                    }
                    await this.uploadFirmware(payload);
                    this.$refs.searchInput.$refs.input.$data.stateValue = '';
                    this.pagination.current = 1;
                    this.search = '';
                    await this.getListFirmware();
                    this.showModal = false;
                    this.$notification.success({
                        message: 'Thêm firmware thành công'
                    });
                } catch (error) {
                    this.$notification.error({
                        message: 'Thêm firmware không thành công'
                    });
                }
            });
        },
        async showCreateForm() {
            await this.getListPhanCung();
            for (let key in this.firmwareInfo) {
                if (key == 'note') this.firmwareInfo[key] = '';
                this.firmwareInfo[key] = null;
            }
            this.showModal = true;
        },
        async updateTestToOfficial(firmware) {
            if (this.checkTestNull(firmware) && this.checkOfficialNull(firmware)) {
                this.$notification.error({
                    message: 'Chưa có phiên bản thử nghiệm hay chính thức'
                });
                return;
            }
            if (this.checkTestNull(firmware)) {
                this.$notification.success({
                    message: 'Đã ở phiên bản mới nhất'
                });
                return;
            }
            try {
                await this.releaseFirmware(firmware.id);
                await this.getListFirmware();
                this.$notification.success({
                    message: 'Đưa bản thử nghiệm lên chính thức thành công'
                });
            } catch (error) {
                this.$notification.error({
                    message: 'Đưa bản thử nghiệm lên chính thức không thành công'
                });
            }
        },
        async deleteTest(firmware) {
            if (this.checkTestNull(firmware)) {
                this.$notification.error({
                    message: 'Chưa có bản thử nghiệm'
                });
                return;
            }
            try {
                await this.disableTestFirmware(firmware.id);
                await this.getListFirmware();
                this.$notification.success({
                    message: 'Xoá bản thử nghiệm thành công'
                });
            } catch (error) {
                this.$notification.error({
                    message: 'Xoá bản thử nghiệm không thành công'
                });
            }
        },
        async handleDeleteFirmware(firmware) {
            try {
                await this.deleteFirmware(firmware.id);
                await this.getListFirmware();
                this.$notification.success({
                    message: 'Xoá firmware thành công'
                });
            } catch (error) {
                this.$notification.error({
                    message: 'Xoá firmware không thành công'
                });
            }
        },
        checkTestNull(firmware) {
            return (
                firmware.version_test === null &&
                firmware.build_test === null &&
                firmware.note_test === null
            );
        },
        checkOfficialNull(firmware) {
            return firmware.version === null && firmware.build === null && firmware.note === null;
        },
        customRequest(request) {
            this.firmwareInfo.file = request.file;
        },
        onSearch(value) {
            this.search = value;
            this.pagination.current = 1;
        },
        searchPhanCung: debounce(function (value) {
            this.searchHardware = value;
        }, 300)
    },
    async mounted() {
        await this.getListFirmware();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable ? columns : columns.slice(0, -1);
    }
};
</script>

<style lang="less" scoped>
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
.note {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
}
</style>
