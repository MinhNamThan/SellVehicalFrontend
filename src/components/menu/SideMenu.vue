<template>
    <a-layout-sider
        :theme="sideTheme"
        :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']"
        width="256px"
        :collapsible="collapsible"
        :collapsed="collapsed"
        :trigger="null"
    >
        <div :class="['logo', theme]">
            <router-link :to="homeRoute">
                <img src="@/assets/img/logo.png" />
                <h1>JAVIS Smart</h1>
            </router-link>
        </div>
        <i-menu
            :theme="theme"
            :collapsed="collapsed"
            :options="menuData"
            @select="onSelect"
            class="menu"
        />
    </a-layout-sider>
</template>

<script>
import IMenu from './menu';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { getFirstRoutePath } from '@/utils/routerUtil';

export default {
    name: 'SideMenu',
    components: { IMenu },
    props: {
        collapsible: {
            type: Boolean,
            required: false,
            default: false
        },
        collapsed: {
            type: Boolean,
            required: false,
            default: false
        },
        menuData: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            required: false,
            default: 'dark'
        }
    },
    data() {
        return { homeRoute: '' };
    },
    computed: {
        sideTheme() {
            return this.theme == 'light' ? this.theme : 'dark';
        },
        ...mapState('setting', ['isMobile', 'systemName']),
        ...mapGetters('account', ['permissions'])
    },
    watch: {
        permissions() {
            const path = getFirstRoutePath();
            this.homeRoute = path ? path : '/dang-nhap';
        }
    },
    methods: {
        ...mapMutations('setting', ['setSelectedPath']),
        onSelect(obj) {
            this.setSelectedPath(obj.key);
            this.$emit('menuSelect', obj);
        }
    },
    mounted() {
        const path = getFirstRoutePath();
        this.homeRoute = path ? path : '/dang-nhap';
    }
};
</script>

<style lang="less" scoped>
@import 'index';
</style>
