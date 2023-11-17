<template>
    <div>
        <h2 :style="{ fontSize: '18px' }">Danh sách khách hàng</h2>
        <a-row class="mb-1">
            <a-col :xs="24" :sm="24" :md="8">
                <p>{{ getStatistics() }}</p>
            </a-col>
            <a-col v-if="modifiable">
                <div
                    class="float-right"
                    :style="{
                        marginTop: '-8px',
                        marginRight: '-9px'
                    }"
                >
                    <a-row :gutter="24">
                        <a-col :xs="15" :md="17">
                            <a-input
                                v-model="email"
                                placeholder="Email"
                                :style="width < 768 ? { width: '100%' } : { width: '250px' }"
                                allowClear
                            />
                        </a-col>
                        <a-col :xs="9" :md="7">
                            <a-button icon="plus" type="primary" class="px-md-2" @click="add">
                                Thêm
                            </a-button>
                        </a-col>
                    </a-row>
                </div>
            </a-col>
        </a-row>
        <a-table
            bordered
            :rowKey="(r, i) => i"
            :columns="columns"
            :dataSource="listKhachHangTheoNhom"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 949 ? { x: 1000, y: height * 0.25 } : { y: height * 0.25 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="date" slot-scope="text">
                {{ moment(text).format('DD/MM/YYYY') }}
            </template>
            <template slot="action" slot-scope="text, record">
                <a-popconfirm
                    title="Bạn có chắc chắn muốn xoá khách hàng này khỏi nhóm không?"
                    @confirm="onDelete(record)"
                >
                    <a-tooltip title="Xoá khách hàng">
                        <a-button shape="circle" icon="delete" type="danger" />
                    </a-tooltip>
                </a-popconfirm>
            </template>
        </a-table>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapState } from 'vuex';
import { columns, pagination } from './const';

export default {
    name: 'ChiTietNhomKhachHang',
    props: ['modifiable', 'nhomKhachHangId'],
    data() {
        return {
            columns: columns.slice(0, -1),
            pagination,
            email: ''
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('khachHangTheoNhom', ['listKhachHangTheoNhom'])
    },
    methods: {
        moment,
        ...mapActions('khachHangTheoNhom', [
            'saveKhachHangTheoNhom',
            'getListKhachHangTheoNhom',
            'deleteKhachHangTheoNhom'
        ]),
        async getData() {
            await this.getListKhachHangTheoNhom(this.nhomKhachHangId);
            this.pagination.total = this.listKhachHangTheoNhom.length;
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
        async add() {
            try {
                this.email = this.email.trim();
                if (this.email === '')
                    this.$notification['error']({
                        message: 'Vui lòng nhập email'
                    });
                else if (this.listKhachHangTheoNhom.find((item) => item.email === this.email))
                    this.$notification['error']({
                        message: 'Khách hàng này đã có trong nhóm'
                    });
                else {
                    await this.saveKhachHangTheoNhom({
                        groupId: this.nhomKhachHangId,
                        data: { email: this.email }
                    });
                    await this.getData();
                    this.email = '';
                    this.$notification['success']({
                        message: 'Thêm khách hàng thành công'
                    });
                }
            } catch (error) {
                this.$notification['error']({
                    message: 'Email này chưa tồn tại trên hệ thống'
                });
            }
        },
        async onDelete(record) {
            try {
                await this.deleteKhachHangTheoNhom({
                    groupId: this.nhomKhachHangId,
                    customerId: record.id
                });
                await this.getData();
                this.$notification['success']({
                    message: 'Xoá khách hàng thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá khách hàng không thành công'
                });
            }
        }
    },
    async mounted() {
        await this.getData();
        if (this.modifiable) this.columns = columns;
    }
};
</script>
