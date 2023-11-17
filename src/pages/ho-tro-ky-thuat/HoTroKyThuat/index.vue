<template>
    <a-card
        :body-style="width < 410 ? { padding: '18px' } : { padding: '24px 32px' }"
        :bordered="false"
    >
        <h1 class="title">Hỗ trợ kỹ thuật</h1>

        <a-form :form="form" @submit="getInfo">
            <a-form-item label="Nhập địa chỉ MAC:">
                <a-input
                    class="input-mac-address"
                    v-decorator="decorator"
                    placeholder="AA:BB:CC:DD:EE:FF"
                ></a-input>
            </a-form-item>
            <a-form-item>
                <a-button http-type="submit" type="primary" @click="getInfo" class="mt-2">
                    Xem thông tin
                </a-button>
            </a-form-item>
        </a-form>

        <a-descriptions
            title="Thông tin thiết bị"
            :column="width < 1000 ? 1 : 2"
            :layout="width < 1000 ? 'vertical' : 'horizontal'"
            bordered
            :class="width < 386 ? 'custom-descriptions mt-3' : 'mt-3'"
            v-if="deviceDetail"
        >
            <a-descriptions-item label="Địa chỉ MAC thiết bị">
                {{ deviceDetail.macAddress }}
            </a-descriptions-item>
            <a-descriptions-item label="Username (web)">
                {{ deviceDetail.userName }}
            </a-descriptions-item>
            <a-descriptions-item label="Remote URL">
                <a :href="deviceDetail.remoteURL" target="_blank">{{ deviceDetail.remoteURL }}</a>
            </a-descriptions-item>
            <a-descriptions-item label="Password (web)">
                {{ deviceDetail.password }}
            </a-descriptions-item>
            <a-descriptions-item label="SSH URL">
                {{ deviceDetail.sshURL }}
            </a-descriptions-item>
            <a-descriptions-item label="SSH password">
                {{ deviceDetail.sshPassword }}
            </a-descriptions-item>
            <a-descriptions-item label="SSH URL 2">
                {{ deviceDetail.sshURL2 }}
            </a-descriptions-item>
        </a-descriptions>
    </a-card>
</template>

<script>
import { mapState } from 'vuex';
import { getDeviceDetail, getMacFormRules } from '../../../utils/gatewayUtil';

export default {
    name: 'HoTroKyThuat',
    data() {
        return {
            deviceDetail: null,
            form: this.$form.createForm(this),
            decorator: [
                'macAddress',
                {
                    rules: getMacFormRules()
                }
            ]
        };
    },
    computed: {
        ...mapState('window', ['width'])
    },
    methods: {
        getInfo(e) {
            e.preventDefault();
            this.form.validateFields((err) => {
                this.deviceDetail = null;
                if (!err) {
                    const address = this.form.getFieldValue('macAddress');
                    this.deviceDetail = getDeviceDetail(address);
                }
            });
        }
    }
};
</script>

<style scoped>
.input-mac-address {
    max-width: 800px;
}
</style>
