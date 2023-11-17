<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách ứng dụng</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button icon="plus" class="float-md-right" type="primary" @click="showCreateForm">
                    Thêm ứng dụng
                </a-button>
            </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <p>{{ getStatistics() }}</p>
            </a-col>
        </a-row>
        <a-table
            bordered
            :rowKey="(record, index) => index"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.67 } : { y: height * 0.67 }"
            @change="handleTableChange"
        >
            <template slot="no" slot-scope="text, record, index">{{ getIndex(index) }}</template>
            <template slot="application_info_test" slot-scope="text, record">
                <div v-if="!checkTestNull(record)">
                    <p><strong>Phiên bản</strong>: {{ record.version_test }}</p>
                    <p><strong>Build</strong>: {{ record.build_test }}</p>
                    <p class="mb-1"><strong>Ghi chú</strong>:</p>
                    <pre class="note">{{ record.note_test }}</pre>
                </div>
            </template>
            <template slot="application_info" slot-scope="text, record">
                <div v-if="!checkOfficialNull(record)">
                    <p><strong>Phiên bản</strong>: {{ record.version }}</p>
                    <p><strong>Build</strong>: {{ record.build }}</p>
                    <p class="mb-1"><strong>Ghi chú</strong>:</p>
                    <pre class="note">{{ record.note }}</pre>
                </div>
            </template>
            <template slot="action" slot-scope="text, record">
                <a-space :direction="width < 1500 ? 'vertical' : 'horizontal'">
                    <a-tooltip title="Chỉnh sửa thông tin">
                        <a-button
                            icon="form"
                            type="link"
                            shape="circle"
                            class="btn bg-green"
                            @click="showEditForm(record)"
                        ></a-button>
                    </a-tooltip>
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn xoá ứng dụng này không?"
                        @confirm="handleDeleteApp(record)"
                        ><a-tooltip title="Xoá ứng dụng">
                            <a-button icon="delete" type="danger" shape="circle"></a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </a-table>
        <a-modal
            v-model="showModal"
            destroyOnClose
            :width="appInfo.id ? (width < 750 ? null : 750) : width < 500 ? null : 500"
        >
            <template slot="title">
                <h1 class="title m-0">
                    {{ appInfo.id ? 'Chỉnh sửa thông tin ứng dụng' : 'Thêm ứng dụng' }}
                </h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="appInfo"
                :rules="rules"
                ref="applicationForm"
            >
                <a-row v-if="appInfo.id" :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Mã ứng dụng" prop="package">
                            <a-input v-model="appInfo.package" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Tên ứng dụng" prop="name">
                            <a-input v-model="appInfo.name" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row v-if="appInfo.id" :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Phiên bản (thử nghiệm)" prop="version_test">
                            <a-input v-model="appInfo.version_test" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Phiên bản (chính thức)" prop="version">
                            <a-input v-model="appInfo.version" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Build (thử nghiệm)" prop="build_test">
                            <a-input-number v-model="appInfo.build_test" :min="1" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Build (chính thức)" prop="build">
                            <a-input-number v-model="appInfo.build" :min="1" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Ghi chú (thử nghiệm)" prop="note_test">
                            <a-textarea v-model="appInfo.note_test" :rows="10" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Ghi chú (chính thức)" prop="note">
                            <a-textarea v-model="appInfo.note" :rows="10" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div v-else>
                    <a-form-model-item label="Mã ứng dụng" prop="package">
                        <a-input v-model="appInfo.package" />
                    </a-form-model-item>
                    <a-form-model-item label="Tên ứng dụng" prop="name">
                        <a-input v-model="appInfo.name" />
                    </a-form-model-item>
                </div>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <div v-if="appInfo.id">
                        <div v-if="width >= 522">
                            <div class="float-left">
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn đưa bản thử nghiệm này lên chính thức không?"
                                    @confirm="updateTestToOfficial()"
                                >
                                    <a-button
                                        icon="check-circle"
                                        type="link"
                                        class="btn bg-green px-2"
                                    >
                                        Đưa lên chính thức
                                    </a-button>
                                </a-popconfirm>
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn xoá bản thử nghiệm này không?"
                                    @confirm="deleteTest()"
                                >
                                    <a-button
                                        icon="close-circle"
                                        type="link"
                                        class="btn bg-orange px-2"
                                    >
                                        Xóa bản thử nghiệm
                                    </a-button>
                                </a-popconfirm>
                            </div>
                            <a-button @click="showModal = false">Huỷ</a-button>
                            <a-button type="primary" @click="handleOk">Lưu</a-button>
                        </div>
                        <div v-else>
                            <a-row class="mb-3" type="flex" justify="center" :gutter="[10, 10]">
                                <a-col>
                                    <a-popconfirm
                                        title="Bạn có chắc chắn muốn đưa bản thử nghiệm này lên chính thức không?"
                                        @confirm="updateTestToOfficial()"
                                    >
                                        <a-button
                                            icon="check-circle"
                                            type="link"
                                            class="btn bg-green px-2"
                                        >
                                            Đưa lên chính thức
                                        </a-button>
                                    </a-popconfirm>
                                </a-col>
                                <a-col>
                                    <a-popconfirm
                                        title="Bạn có chắc chắn muốn xoá bản thử nghiệm này không?"
                                        @confirm="deleteTest()"
                                    >
                                        <a-button
                                            icon="close-circle"
                                            type="link"
                                            class="btn bg-orange px-2"
                                        >
                                            Xóa bản thử nghiệm
                                        </a-button>
                                    </a-popconfirm>
                                </a-col>
                            </a-row>
                            <a-row type="flex" justify="center" :gutter="[10, 10]">
                                <a-col>
                                    <a-button @click="showModal = false">Huỷ</a-button>
                                </a-col>
                                <a-col>
                                    <a-button type="primary" @click="handleOk">Lưu</a-button>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                    <div v-else>
                        <a-button @click="showModal = false">Huỷ</a-button>
                        <a-button type="primary" @click="handleOk">Lưu</a-button>
                    </div>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import { columns, pagination, rules } from './const';

export default {
    name: 'QuanLyUngDung',
    data() {
        return {
            showModal: false,
            columns: null,
            pagination,
            appInfo: {
                package: null,
                name: null
            },
            rules,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('ungDung', ['listUngDung']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            let clone = cloneDeep(this.listUngDung);
            return clone;
        }
    },
    methods: {
        ...mapActions('ungDung', [
            'saveUngDung',
            'getListUngDung',
            'updateUngDung',
            'deleteUngDung'
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
        async handleOk() {
            this.$refs.applicationForm.validate(async (valid) => {
                if (!valid) return;

                if (
                    !this.appInfo.id &&
                    this.listUngDung.find((item) => item.package === this.appInfo.package.trim())
                ) {
                    this.$notification['error']({
                        message: 'Mã ứng dụng này đã tồn tại trong hệ thống'
                    });
                    return;
                }

                const id = this.appInfo.id;
                try {
                    trimObject(this.appInfo);
                    if (id) await this.updateUngDung(this.appInfo);
                    else await this.saveUngDung(this.appInfo);
                    await this.getListUngDung();
                    this.pagination.total = this.listUngDung.length;
                    this.showModal = false;
                    this.$notification.success({
                        message: `${id ? 'Cập nhật' : 'Thêm'} ứng dụng thành công`
                    });
                } catch (error) {
                    this.$notification.error({
                        message: `${id ? 'Cập nhật' : 'Thêm'} ứng dụng không thành công`
                    });
                }
            });
        },
        showCreateForm() {
            for (let key in this.appInfo) {
                this.appInfo[key] = null;
            }
            this.showModal = true;
        },
        showEditForm(app) {
            this.appInfo = { ...app };
            this.showModal = true;
        },
        async updateTestToOfficial() {
            if (this.checkTestNull(this.appInfo) && this.checkOfficialNull(this.appInfo)) {
                this.$notification.error({
                    message: 'Chưa có phiên bản thử nghiệm hay chính thức'
                });
                return;
            }
            if (this.checkTestNull(this.appInfo)) {
                this.$notification.success({
                    message: 'Đã ở phiên bản mới nhất'
                });
                return;
            }
            this.appInfo.version = this.appInfo.version_test;
            this.appInfo.build = this.appInfo.build_test;
            this.appInfo.note = this.appInfo.note_test;
            this.appInfo.data = this.appInfo.data_test;
            this.appInfo.version_test = null;
            this.appInfo.build_test = null;
            this.appInfo.note_test = null;
            this.appInfo.data_test = null;
            try {
                await this.updateUngDung(this.appInfo);
                await this.getListUngDung();
                this.pagination.total = this.listUngDung.length;
                this.$notification.success({
                    message: 'Đưa bản thử nghiệm lên chính thức thành công'
                });
            } catch (error) {
                this.$notification.error({
                    message: 'Đưa bản thử nghiệm lên chính thức không thành công'
                });
            }
        },
        async deleteTest() {
            if (this.checkTestNull(this.appInfo)) {
                this.$notification.error({
                    message: 'Chưa có bản thử nghiệm'
                });
                return;
            }
            this.appInfo.version_test = null;
            this.appInfo.build_test = null;
            this.appInfo.note_test = null;
            this.appInfo.data_test = null;
            try {
                await this.updateUngDung(this.appInfo);
                await this.getListUngDung();
                this.pagination.total = this.listUngDung.length;
                this.$notification.success({
                    message: 'Xoá bản thử nghiệm thành công'
                });
            } catch (error) {
                this.$notification.error({
                    message: 'Xoá bản thử nghiệm không thành công'
                });
            }
        },
        async handleDeleteApp(app) {
            try {
                await this.deleteUngDung(app.id);
                await this.getListUngDung();
                this.pagination.total = this.listUngDung.length;
                this.$notification.success({
                    message: 'Xoá ứng dụng thành công'
                });
            } catch (error) {
                this.$notification.error({
                    message: 'Xoá ứng dụng không thành công'
                });
            }
        },
        checkTestNull(app) {
            return app.version_test === null && app.build_test === null && app.note_test === null;
        },
        checkOfficialNull(app) {
            return app.version === null && app.build === null && app.note === null;
        }
    },
    async mounted() {
        await this.getListUngDung();
        this.pagination.total = this.listUngDung.length;
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable ? columns : columns.slice(0, -1);
    }
};
</script>

<style scoped>
.note {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
}
</style>
