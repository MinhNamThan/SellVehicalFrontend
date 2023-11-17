import Vue from 'vue';
import App from './App.vue';
import { initRouter } from './router';
import './theme/index.less';
import Antd from 'ant-design-vue';
import store from './store';
import 'animate.css/source/animate.css';
import Plugins from '@/plugins';
import { initI18n } from '@/utils/i18n';
import bootstrap from '@/bootstrap';
import 'moment/locale/vi';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const router = initRouter();
const i18n = initI18n('VN', 'US');

Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(Plugins);
bootstrap({
    router,
    store,
    i18n,
    message: Vue.prototype.$message,
    notification: Vue.prototype.$notification
});
Vue.component('DynamicScroller', DynamicScroller);
Vue.component('DynamicScrollerItem', DynamicScrollerItem);

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
}).$mount('#app');
