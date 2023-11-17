<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <h1 :class="width < 768 ? '' : 'title'">Danh sách thiết bị</h1>
        <DanhSachThietBi />
    </a-card>
</template>

<script>
import DanhSachThietBi from './DanhSachThietBi';
import { mapState } from 'vuex';

export default {
    name: 'ThietBi',
    components: { DanhSachThietBi },
    computed: {
        ...mapState('window', ['width', 'height'])
    }
};
</script>
