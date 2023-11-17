<template>
    <div class="mt-4">
        <h2 style="font-size: 18px; margin-bottom: 16px">Thông tin bổ sung</h2>
        <div class="card">
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
                            moment(baoGia.updatedAt ? baoGia.updatedAt : baoGia.created).format(
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
                    v-model="baoGia.note"
                    :rows="2"
                />
            </div>
            <a-row v-else>
                <a-col :span="12">
                    <h4>Ghi chú đơn hàng</h4>
                </a-col>
                <a-col :span="12">
                    <p class="mb-0">{{ baoGia.note ? baoGia.note : 'Chưa có ghi chú' }}</p>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'ThongTinBoSung',
    inject: ['permission'],
    computed: {
        ...mapState('baoGia', ['baoGia']),
        ...mapGetters('account', ['user'])
    },
    methods: {
        moment
    }
};
</script>

<style lang="less" scoped>
.card {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    &:hover {
        border: 1px solid #7cc0ff;
    }
    padding: 12px;
}
</style>
