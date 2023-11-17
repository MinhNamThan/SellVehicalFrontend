<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <h1 :class="width < 576 ? '' : 'title'">Danh sách nhóm khách hàng</h1>
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
            :dataSource="listNhomKhachHang"
            :rowClassName="rowClassName"
            :customRow="customRow"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.64 } : { y: height * 0.64 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="type" slot-scope="text">
                <a-tag :color="getTagColor(text)" class="m-0"> {{ text }} </a-tag>
            </template>
        </a-table>
        <a-modal
            v-model="modalVisible"
            destroyOnClose
            :width="form.id ? (width < 1000 ? null : 1000) : 500"
        >
            <template slot="title">
                <h1 class="title m-0">
                    {{ form.id ? 'Thông tin nhóm khách hàng' : 'Thêm nhóm khách hàng' }}
                </h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="form"
                :rules="formRules"
                ref="form"
                v-if="modifiable"
            >
                <a-row>
                    <a-col :xs="24" :sm="24" :md="form.id ? 12 : 24">
                        <a-form-model-item label="Tên nhóm" prop="name">
                            <a-input
                                v-model="form.name"
                                :style="
                                    form.id
                                        ? width < 768
                                            ? { width: '100%' }
                                            : { width: '408px' }
                                        : null
                                "
                            />
                        </a-form-model-item>
                        <a-form-model-item label="Loại nhóm" prop="type">
                            <div :style="{ marginTop: '-10px' }">
                                <a-radio-group v-model="form.type">
                                    <a-radio
                                        v-for="(type, index) in types"
                                        :key="index"
                                        :value="type.name"
                                    >
                                        <a-tag :color="type.color" class="m-0">
                                            {{ type.name }}
                                        </a-tag>
                                    </a-radio>
                                </a-radio-group>
                            </div>
                        </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="form.id ? 12 : 24">
                        <a-form-model-item label="Mô tả" prop="desc">
                            <a-textarea v-model="form.desc" />
                        </a-form-model-item>
                        <div class="float-right mt-3" v-if="form.id">
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn xoá nhóm này không?"
                                @confirm="onDelete(form)"
                            >
                                <a-button icon="delete" type="danger" class="px-2 mr-3">
                                    Xoá nhóm
                                </a-button>
                            </a-popconfirm>
                            <a-button
                                icon="save"
                                type="link"
                                class="btn bg-green px-2"
                                @click="edit"
                                >Lưu chỉnh sửa</a-button
                            >
                        </div>
                    </a-col>
                </a-row>
            </a-form-model>

            <a-descriptions :column="1" bordered v-else>
                <a-descriptions-item label="Tên nhóm">
                    {{ form.name }}
                </a-descriptions-item>
                <a-descriptions-item label="Loại nhóm">
                    <a-tag :color="getTagColor(form.type)" class="m-0">
                        {{ form.type }}
                    </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Mô tả">
                    {{ form.desc }}
                </a-descriptions-item>
            </a-descriptions>

            <ChiTietNhomKhachHang
                class="mt-3"
                :modifiable="modifiable"
                :nhomKhachHangId="nhomKhachHangId"
                v-if="form.id"
            />
            <template slot="footer">
                <div class="mx-2 my-1">
                    <div v-if="form.id">
                        <a-button @click="hideModal">Đóng</a-button>
                    </div>
                    <div v-else>
                        <div class="float-left" :style="{ marginTop: '6px' }">
                            <a-checkbox @change="toggleContinueToAdd"
                                >Tiếp tục tạo nhóm mới</a-checkbox
                            >
                        </div>
                        <a-button @click="hideModal">Huỷ</a-button>
                        <a-button type="primary" @click="add">Lưu</a-button>
                    </div>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import ChiTietNhomKhachHang from './ChiTietNhomKhachHang';
import { columns, formRules, pagination, types } from './const';

export default {
    name: 'NhomKhachHang',
    components: { ChiTietNhomKhachHang },
    data() {
        return {
            columns,
            pagination,
            modalVisible: false,
            form: {},
            formRules,
            continueToAdd: false,
            nhomKhachHangId: null,
            types,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('nhomKhachHang', ['listNhomKhachHang']),
        ...mapGetters('account', ['permissions'])
    },
    methods: {
        ...mapActions('nhomKhachHang', [
            'saveNhomKhachHang',
            'updateNhomKhachHang',
            'getListNhomKhachHang',
            'deleteNhomKhachHang'
        ]),
        async getData() {
            await this.getListNhomKhachHang();
            this.pagination.total = this.listNhomKhachHang.length;
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
            return types.find((item) => item.name === type)?.color;
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
        showAddModal() {
            this.form = { type: 'General' };
            this.continueToAdd = false;
            this.modalVisible = true;
        },
        showDetailsModal(item) {
            this.form = JSON.parse(JSON.stringify(item));
            this.nhomKhachHangId = item.id;
            this.modalVisible = true;
        },
        hideModal() {
            this.modalVisible = false;
        },
        toggleContinueToAdd() {
            this.continueToAdd = !this.continueToAdd;
        },
        add() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.form);
                    await this.saveNhomKhachHang(this.form);
                    await this.getData();
                    this.continueToAdd
                        ? (this.form = { type: 'General' })
                        : (this.modalVisible = false);
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
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.form);
                    await this.updateNhomKhachHang(this.form);
                    await this.getData();
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
                await this.deleteNhomKhachHang(item.id);
                await this.getData();
                this.modalVisible = false;
                this.$notification['success']({
                    message: 'Xoá nhóm thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá nhóm không thành công'
                });
            }
        }
    },
    async mounted() {
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
    }
};
</script>
