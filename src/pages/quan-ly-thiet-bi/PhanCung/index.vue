<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách phần cứng</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button icon="plus" class="float-md-right" type="primary" @click="showCreateForm">
                    Thêm phần cứng
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
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="dataSource"
            :pagination="pagination"
            bordered
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
        >
            <template slot="guarantee" slot-scope="text">
                <span>{{ text + ' tháng' }}</span>
            </template>

            <template slot="no" slot-scope="text, record, index">
                {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
            </template>

            <template slot="action" slot-scope="text, record">
                <a-popconfirm
                    title="Bạn có chắc chắn muốn xoá phần cứng này không?"
                    @confirm="onDelete(record)"
                >
                    <a-tooltip title="Xoá phần cứng">
                        <a-button shape="circle" icon="delete" type="danger" />
                    </a-tooltip>
                </a-popconfirm>
            </template>
        </a-table>

        <a-modal v-model="visibleFormCreate" destroyOnClose>
            <template slot="title">
                <h1 class="title m-0">Thêm phần cứng</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="formCreate"
                :rules="rules"
                ref="formCreate"
            >
                <a-form-model-item label="Mã phần cứng" prop="name">
                    <a-input v-model="formCreate.name" />
                </a-form-model-item>
                <a-form-model-item label="Mô tả" prop="type">
                    <a-input v-model="formCreate.type" />
                </a-form-model-item>
                <a-form-model-item label="Thời gian bảo hành (tháng)" prop="guarantee">
                    <a-input-number v-model="formCreate.guarantee" :min="1" />
                </a-form-model-item>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="handleCancel">Huỷ</a-button>
                    <a-button type="primary" @click="handleOk">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import { trimObject } from '@/utils/formUtil';
import { isSubstring } from '@/utils/stringUtil';
import { mapActions, mapGetters, mapState } from 'vuex';
import { columns, pagination, rules } from './const';

export default {
    data() {
        return {
            columns: null,
            pagination,
            search: '',
            visibleFormCreate: false,
            formCreate: {
                name: null,
                type: null,
                guarantee: null
            },
            rules,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('phanCung', ['listPhanCung']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            return this.listPhanCung.filter((item) =>
                [item.name, item.type].find((i) =>
                    typeof i === 'string' ? isSubstring(this.search, i) : false
                )
            );
        }
    },
    watch: {
        dataSource(value) {
            this.pagination.total = value.length;
        }
    },
    methods: {
        ...mapActions('phanCung', ['getListPhanCung', 'savePhanCung', 'deletePhanCung']),
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
        showCreateForm() {
            this.formCreate = {};
            this.visibleFormCreate = true;
        },
        handleOk() {
            this.$refs.formCreate.validate(async (valid) => {
                if (!valid) return;

                if (this.listPhanCung.find((item) => item.name === this.formCreate.name.trim())) {
                    this.$notification['error']({
                        message: 'Mã phần cứng này đã tồn tại trong hệ thống'
                    });
                    return;
                }

                try {
                    trimObject(this.formCreate);
                    await this.savePhanCung(this.formCreate);
                    this.$refs.searchInput.$refs.input.$data.stateValue = '';
                    this.pagination.current = 1;
                    this.search = '';
                    await this.getListPhanCung();
                    this.visibleFormCreate = false;
                    this.$notification['success']({ message: 'Thêm phần cứng thành công' });
                } catch (error) {
                    this.$notification['error']({ message: 'Thêm phần cứng không thành công' });
                }
            });
        },
        handleCancel() {
            this.visibleFormCreate = false;
        },
        async onDelete(item) {
            try {
                await this.deletePhanCung(item.id);
                await this.getListPhanCung();
                this.$notification['success']({
                    message: 'Xoá phần cứng thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá phần cứng không thành công'
                });
            }
        },
        onSearch(value) {
            this.search = value;
            this.pagination.current = 1;
        }
    },
    async mounted() {
        await this.getListPhanCung();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable ? columns : columns.slice(0, -1);
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
