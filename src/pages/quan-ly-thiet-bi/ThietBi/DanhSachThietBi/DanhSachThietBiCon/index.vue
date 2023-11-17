<template>
    <div>
        <p>{{ getStatistics() }}</p>
        <a-table
            bordered
            :rowKey="(r, i) => i"
            :columns="columns"
            :dataSource="listThietBiCon"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 959 ? { x: 1000, y: height * 0.5 } : { y: height * 0.5 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
        </a-table>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { columns, pagination } from './const';

export default {
    name: 'ThietBiCon',
    props: ['thietBiId'],
    data() {
        return {
            columns,
            pagination
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('thietBiCon', ['listThietBiCon'])
    },
    methods: {
        ...mapActions('thietBiCon', ['getListThietBiCon']),
        async getData() {
            await this.getListThietBiCon(this.thietBiId);
            this.pagination.total = this.listThietBiCon.length;
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
        }
    },
    async mounted() {
        await this.getData();
    }
};
</script>
