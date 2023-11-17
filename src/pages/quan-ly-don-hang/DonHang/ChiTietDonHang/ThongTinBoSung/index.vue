<template>
    <div class="mt-4">
        <h2 class="mb-3" :style="{ fontSize: '18px' }">Thông tin bổ sung</h2>
        <div class="card my-3">
            <a-row>
                <a-col :span="12">
                    <h4>Đại lý</h4>
                </a-col>
                <a-col :span="12">
                    <p>{{ user.agent.name }}</p>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <h4>Lần cập nhật cuối</h4>
                </a-col>
                <a-col :span="12">
                    <p>
                        {{
                            moment(donHang.updatedAt ? donHang.updatedAt : donHang.created).format(
                                'DD/MM/YYYY HH:mm:ss'
                            )
                        }}
                    </p>
                </a-col>
            </a-row>
            <div v-if="permission.modifiable">
                <h4>Ghi chú đơn hàng</h4>
                <a-textarea
                    style="margin-top: 8px; margin-bottom: 10px"
                    v-model="donHang.note"
                    :rows="2"
                />
            </div>
            <a-row v-else>
                <a-col :span="12">
                    <h4>Ghi chú đơn hàng</h4>
                </a-col>
                <a-col :span="12">
                    <p class="mb-0">{{ donHang.note ? donHang.note : 'Chưa có ghi chú' }}</p>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
export default {
    inject: ['permission'],
    computed: {
        ...mapState('donHang', ['donHang']),
        ...mapGetters('account', ['user'])
    },
    methods: {
        moment
    }
};
</script>

<style lang="less" scoped>
.card {
    min-height: 194px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    &:hover {
        border: 1px solid #7cc0ff;
    }
    padding: 12px;
}
</style>
