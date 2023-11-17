<template>
    <exception-page :home-route="homeRoute" :style="`min-height: ${minHeight}`" type="500" />
</template>

<script>
import ExceptionPage from '@/components/exception/ExceptionPage';
import { mapState } from 'vuex';
import { getFirstRoutePath } from '@/utils/routerUtil';

export default {
    name: 'Exp500',
    components: { ExceptionPage },
    data() {
        return { homeRoute: '' };
    },
    computed: {
        ...mapState('setting', ['pageMinHeight']),
        minHeight() {
            return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh';
        }
    },
    mounted() {
        const path = getFirstRoutePath();
        this.homeRoute = path ? path : '/dang-nhap';
    }
};
</script>

<style scoped lang="less"></style>
