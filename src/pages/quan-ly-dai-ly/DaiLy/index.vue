<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách đại lý</h1>
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
                    Thêm đại lý
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
            :dataSource="dataSource"
            :rowClassName="rowClassName"
            :customRow="customRow"
            :pagination="pagination"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
            @change="handleTableChange"
        >
            <template slot="no" slot-scope="text, record, index">{{ getIndex(index) }}</template>
            <template slot="status" slot-scope="text, record">
                <a-tag :color="record.disabled ? '#ff7176' : '#28a745'">
                    {{ record.disabled ? 'Không hoạt động' : 'Hoạt động' }}
                </a-tag>
            </template>
        </a-table>
        <a-modal v-model="addModalVisible" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Thêm đại lý</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="addForm"
                :rules="rules"
                ref="addForm"
            >
                <a-form-model-item label="Tên đại lý" prop="name">
                    <a-input v-model="addForm.name" />
                </a-form-model-item>
                <a-form-model-item label="Địa chỉ" prop="address">
                    <a-input v-model="addForm.address" />
                </a-form-model-item>
                <a-form-model-item label="Tỉnh/Thành phố" prop="province">
                    <a-input v-model="addForm.province" />
                </a-form-model-item>
                <a-form-model-item label="Số điện thoại" prop="mobile">
                    <a-input v-model="addForm.mobile" />
                </a-form-model-item>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="addModalVisible = false">Huỷ</a-button>
                    <a-button type="primary" @click="add">Lưu</a-button>
                </div>
            </template>
        </a-modal>
        <a-modal v-model="showDetailAgent" destroyOnClose :width="width < 1100 ? null : 1100">
            <template slot="title">
                <h1 class="title m-0">Đại lý: {{ agentName }}</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="agent"
                :rules="rules"
                ref="editForm"
                v-if="modifiable"
            >
                <a-row>
                    <a-col :span="11">
                        <a-form-model-item label="Tên đại lý" prop="name">
                            <a-input v-model="agent.name" placeholder="Tên đại lý" />
                        </a-form-model-item>
                        <a-form-model-item label="Địa chỉ" prop="address">
                            <a-input v-model="agent.address" placeholder="Địa chỉ" />
                        </a-form-model-item>
                        <a-form-model-item label="Tỉnh/Thành phố" prop="province">
                            <a-input v-model="agent.province" placeholder="Tỉnh/Thành Phố" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="2"></a-col>
                    <a-col :span="11">
                        <a-form-model-item label="Số điện thoại" prop="mobile">
                            <a-input v-model="agent.mobile" placeholder="Số điện thoại" />
                        </a-form-model-item>
                        <a-form-model-item label="Trạng thái" prop="status">
                            <a-tooltip :title="agent.disabled ? 'Không hoạt động' : 'Hoạt động'">
                                <a-switch
                                    :default-checked="!agent.disabled"
                                    @change="handleDisableChange"
                                ></a-switch
                            ></a-tooltip>
                        </a-form-model-item>
                        <a-form-model-item label=" " :colon="false">
                            <div class="float-right">
                                <a-popconfirm
                                    title="Bạn có chắc chắn muốn xoá đại lý này không?"
                                    @confirm="onDelete(agent)"
                                >
                                    <a-button type="danger" icon="delete" class="px-2 mr-2">
                                        Xoá đại lý
                                    </a-button>
                                </a-popconfirm>
                                <a-button
                                    icon="save"
                                    type="link"
                                    class="btn bg-green px-2"
                                    @click="edit"
                                >
                                    Lưu chỉnh sửa
                                </a-button>
                            </div>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>

            <a-descriptions :column="width < 600 ? 1 : 2" bordered v-else>
                <a-descriptions-item label="Tên đại lý">
                    {{ agent.name }}
                </a-descriptions-item>
                <a-descriptions-item label="Tỉnh/Thành phố">
                    {{ agent.province }}
                </a-descriptions-item>
                <a-descriptions-item label="Địa chỉ">
                    {{ agent.address }}
                </a-descriptions-item>
                <a-descriptions-item label="Số điện thoại">
                    {{ agent.mobile }}
                </a-descriptions-item>
                <a-descriptions-item label="Trạng thái">
                    <a-tag :color="agent.disabled ? '#ff4d52' : '#28a745'">
                        {{ agent.disabled ? 'Không hoạt động' : 'Hoạt động' }}
                    </a-tag>
                </a-descriptions-item>
            </a-descriptions>

            <h2 class="mt-3" :style="{ fontSize: '18px' }">Danh sách người dùng</h2>
            <p>{{ getClientStatistics() }}</p>
            <a-table
                bordered
                class="mt-2"
                :rowKey="(r, i) => r.id"
                :columns="columns_client"
                :dataSource="agentUserSource"
                :pagination="pagination_client"
                :scroll="width < 1048 ? { x: 1000, y: height * 0.45 } : { y: height * 0.45 }"
                @change="handleClientTableChange"
            >
                <template slot="no" slot-scope="text, record, index">
                    {{ getIndexClient(index) }}
                </template>
                <template slot="user_group" slot-scope="text, record">
                    {{ record.group ? record.group.name : null }}
                </template>
            </a-table>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="showDetailAgent = false">Đóng</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import { columns, columns_client, pagination, pagination_client, rules } from './const';

export default {
    name: 'DaiLy',
    data() {
        return {
            columns,
            columns_client,
            addModalVisible: false,
            addForm: {},
            rules,
            pagination,
            pagination_client,
            search: '',
            agent: {},
            agentName: '',
            showDetailAgent: false,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('daiLy', ['listDaiLy']),
        ...mapState('nguoiDung', ['listNguoiDung']),
        ...mapGetters('account', ['user', 'permissions']),
        dataSource() {
            let clone = cloneDeep(this.listDaiLy);
            return clone;
        },
        agentUserSource() {
            let clone = cloneDeep(this.listNguoiDung);
            if (this.agent.id) {
                clone = clone.filter((user) => user.agentId == this.agent.id);
            }
            return clone;
        }
    },
    methods: {
        ...mapActions('daiLy', ['saveDaiLy', 'updateDaiLy', 'getListDaiLy', 'deleteDaiLy']),
        ...mapActions('nguoiDung', ['getListNguoiDung']),
        ...mapActions('account', ['getProfile']),
        async getData() {
            await this.getListDaiLy({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                search: this.search
            });
            this.pagination.total = this.listDaiLy.length;
        },
        getIndex(index) {
            return (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
        },
        getIndexClient(index) {
            return (
                (this.pagination_client.current - 1) * this.pagination_client.pageSize + index + 1
            );
        },
        getStatistics() {
            return `${this.pagination.total === 0 ? 0 : this.getIndex(0)}-${
                this.pagination.current * this.pagination.pageSize > this.pagination.total
                    ? this.pagination.total
                    : this.getIndex(this.pagination.pageSize - 1)
            } trong tổng số  ${this.pagination.total}`;
        },
        getClientStatistics() {
            this.pagination_client.total = this.agentUserSource.length;
            return `${this.pagination_client.total === 0 ? 0 : this.getIndexClient(0)}-${
                this.pagination_client.current * this.pagination_client.pageSize >
                this.pagination_client.total
                    ? this.pagination_client.total
                    : this.getIndexClient(this.pagination_client.pageSize - 1)
            } trong tổng số  ${this.pagination_client.total}`;
        },
        handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
        },
        handleClientTableChange(pagination) {
            this.pagination_client.current = pagination.current;
            this.pagination_client.pageSize = pagination.pageSize;
        },
        handleDisableChange(value) {
            this.agent.disabled = !value;
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
        showAddModal() {
            this.addForm = {};
            this.addModalVisible = true;
        },
        showDetailsModal(record) {
            this.agent = cloneDeep(record);
            this.agentName = this.agent.name;
            this.showDetailAgent = true;
        },
        onSearch(value) {
            this.pagination.current = 1;
            this.search = value;
            this.getData();
        },
        add() {
            this.$refs.addForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.addForm);
                    await this.saveDaiLy(this.addForm);
                    await this.getData();
                    this.addModalVisible = false;
                    this.$notification['success']({
                        message: 'Thêm đại lý thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Thêm đại lý không thành công'
                    });
                }
            });
        },
        edit() {
            this.$refs.editForm.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.agent);
                    await this.updateDaiLy(this.agent);
                    this.agentName = this.agent.name;
                    await this.getData();
                    if (this.user.agentId === this.agent.id) await this.getProfile();
                    this.$notification['success']({
                        message: 'Cập nhật đại lý thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: 'Cập nhật đại lý không thành công'
                    });
                }
            });
        },
        async onDelete(item) {
            try {
                await this.deleteDaiLy(item.id);
                await this.getData();
                if (this.user.agentId === item.id) await this.getProfile();
                this.showDetailAgent = false;
                this.$notification['success']({
                    message: 'Xoá đại lý thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá đại lý không thành công'
                });
            }
        }
    },
    async mounted() {
        await this.getData();
        await this.getListNguoiDung();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
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
