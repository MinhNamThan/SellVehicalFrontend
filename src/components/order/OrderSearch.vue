<template>
    <div>
        <a-popover
            :class="disabled ? 'popover-disabled' : ''"
            v-model="isVisible"
            :trigger="disabled ? '' : 'click'"
            :placement="placement"
            :overlayStyle="{
                width: '1000px'
            }"
            :getPopupContainer="(a) => a.parentNode"
            @visibleChange="handlePopoverVisibilityChange"
        >
            <a-button :disabled="disabled" type="primary" :style="buttonStyle">
                {{ $t('search') }}
            </a-button>
            <div slot="content">
                <a-spin :spinning="isLoading">
                    <a-table
                        :columns="columns"
                        :rowKey="(r, i) => i"
                        :data-source="data"
                        :pagination="pagination"
                        bordered
                        size="middle"
                        @change="handleTableChange"
                    >
                        <template slot="selectButton" slot-scope="text, record"
                            ><a-button type="primary" @click="handleOrderSelect(record)">{{
                                $t('select')
                            }}</a-button></template
                        >

                        <template slot="no" slot-scope="text, record, index">{{
                            index + 1 + (pagination.current - 1) * pagination.pageSize
                        }}</template>
                    </a-table>
                </a-spin>
            </div>
        </a-popover>
    </div>
</template>

<script>
import { columns } from './const';
import { mapActions } from 'vuex';
import moment from 'moment';
export default {
    props: ['employeeNumber', 'employeeName', 'placement', 'buttonStyle', 'disabled'],
    data() {
        return {
            isVisible: false,
            isLoading: false,
            columns: columns(this),
            data: [],
            pagination: {
                pageSize: 5,
                total: 0,
                current: 1,
                size: 'small'
            }
        };
    },
    methods: {
        ...mapActions('order', ['searchOrder']),
        handleTableChange(pagination) {
            const pager = { ...pagination };
            pager.current = pagination.current;
            this.pagination = pager;
        },
        handleOrderSelect(order) {
            this.$emit('orderSelect', order);
            this.isVisible = false;
        },
        async handlePopoverVisibilityChange(isVisible) {
            if (!isVisible) return;
            this.isLoading = true;
            let payload = {
                EmpNo: this.employeeNumber ?? '',
                EmpName: this.employeeName ?? ''
            };
            try {
                let data = await this.searchOrder(payload);
                this.pagination.current = 1;
                this.data = [];
                data.data.forEach((emp) => {
                    emp.orders.forEach((order) => {
                        if (moment(order['contract_to'], 'YYYYMMDD').diff(moment(), 'days') > -180)
                            this.data.push({
                                empname: emp.empname,
                                empno: emp.empno,
                                'contract-from': moment(order['contract_from'], 'YYYYMMDD').format(
                                    'YYYY年MM月DD日'
                                ),
                                'contract-to': moment(order['contract_to'], 'YYYYMMDD').format(
                                    'YYYY年MM月DD日'
                                ),
                                orderno: order.orderno
                            });
                    });
                });
            } catch (error) {
                this.data = [];
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style>
.popover-disabled {
    display: initial !important;
    cursor: not-allowed;
}
</style>
