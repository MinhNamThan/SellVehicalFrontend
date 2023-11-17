<template>
    <a-config-provider :locale="locale" :get-popup-container="popContainer">
        <router-view />
    </a-config-provider>
</template>

<script>
import { getI18nKey } from '@/utils/routerUtil';
import { mapMutations, mapState } from 'vuex';
import { enquireScreen } from './utils/util';

export default {
    name: 'App',
    data() {
        return {
            locale: {}
        };
    },
    created() {
        this.setHtmlTitle();
        this.setLanguage(this.lang);
        enquireScreen((isMobile) => this.setDevice(isMobile));
    },
    mounted() {
        this.setLanguage('VN');
        this.setWeekModeTheme(this.weekMode);
        window.onresize = () => {
            this.resize();
        };
    },
    watch: {
        weekMode(val) {
            this.setWeekModeTheme(val);
        },
        lang() {
            this.setLanguage('VN');
            this.setHtmlTitle();
        },
        $route() {
            this.setHtmlTitle();
        },
        layout: function () {
            window.dispatchEvent(new Event('resize'));
        }
    },
    computed: {
        ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
    },
    methods: {
        ...mapMutations('setting', ['setDevice']),
        ...mapMutations('window', ['resize']),
        setWeekModeTheme(weekMode) {
            if (weekMode) {
                document.body.classList.add('week-mode');
            } else {
                document.body.classList.remove('week-mode');
            }
        },
        setLanguage(lang) {
            this.$i18n.locale = lang;
            switch (lang) {
                case 'VN':
                    this.locale = require('ant-design-vue/es/locale-provider/vi_VN').default;
                    break;
                default:
                    this.locale = require('ant-design-vue/es/locale-provider/en_US').default;
                    break;
            }
        },
        setHtmlTitle() {
            const route = this.$route;
            const key =
                route.path === '/'
                    ? 'home.name'
                    : getI18nKey(route.matched[route.matched.length - 1].path);
            document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key);
        },
        popContainer() {
            return document.getElementById('popContainer');
        }
    }
};
</script>
<style>
.ant-time-picker-input[disabled] {
    pointer-events: none;
    color: rgba(0, 0, 0, 0.5) !important;
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 1;
}
.input-greyed-out {
    color: rgba(0, 0, 0, 1) !important;
    background-color: #f5f5f5 !important;
    opacity: 1 !important;
}
.input-greyed-out .ant-input {
    color: rgba(0, 0, 0, 1) !important;
    background-color: #f5f5f5 !important;
    opacity: 1 !important;
}
.ant-input[disabled] {
    pointer-events: none;
    color: rgba(0, 0, 0, 0.5) !important;
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 1;
}
.ant-checkbox-disabled + span {
    color: rgba(0, 0, 0, 0.5) !important;
    cursor: not-allowed;
}
</style>
