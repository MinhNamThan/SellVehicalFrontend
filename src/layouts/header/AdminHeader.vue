<template>
    <a-layout-header :class="[headerTheme, 'admin-header']">
        <div :class="['admin-header-wide', layout, pageWidth]">
            <router-link
                v-if="isMobile || layout === 'head'"
                to="/"
                :class="['logo', isMobile ? null : 'pc', headerTheme]"
            >
                <img width="32" src="@/assets/img/logo.png" />
                <h1 v-if="!isMobile">{{ systemName }}</h1>
            </router-link>
            <a-divider v-if="isMobile" type="vertical" />
            <a-icon
                v-if="layout !== 'head'"
                class="trigger"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                @click="toggleCollapse"
            />
            <div
                v-if="layout !== 'side' && !isMobile"
                class="admin-header-menu"
                :style="`width: ${menuWidth};`"
            >
                <i-menu
                    class="head-menu"
                    :theme="headerTheme"
                    mode="horizontal"
                    :options="menuData"
                    @select="onSelect"
                />
            </div>
            <div :class="['admin-header-right', headerTheme]">
                <header-avatar class="header-item" />
            </div>
        </div>
        <a-card
            :style="{
                position: 'fixed',
                width: '100%',
                height:
                    width > 768
                        ? position > 200
                            ? position > 700
                                ? '96px'
                                : '40px'
                            : '0'
                        : position > 200
                        ? position > 700
                            ? '116px'
                            : '60px'
                        : '0',
                top: width > 768 ? '62px' : '64px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 10px 12px -8px'
            }"
            :bordered="false"
            v-if="Object.keys(baoGia).length !== 0"
        />
        <div
            :style="{
                position: 'fixed',
                width: 'inherit',
                top: width > 768 ? '52px' : '76px',
                padding: '0 56px 0 56px'
            }"
            v-if="Object.keys(baoGia).length !== 0"
        >
            <Transition name="header">
                <a-page-header class="p-0" @back="returnBaoGia" v-show="position > 200">
                    <template slot="title">
                        <span>{{ baoGia.id ? 'Thông tin báo giá' : 'Thêm báo giá' }}</span>
                    </template>
                    <template slot="backIcon">
                        <a-tooltip title="Quay lại">
                            <a-button
                                icon="left"
                                type="link"
                                :style="{
                                    marginTop: '-8px',
                                    marginLeft: '-11px',
                                    marginRight: '-11px'
                                }"
                            />
                        </a-tooltip>
                    </template>
                </a-page-header>
            </Transition>
            <Transition name="list">
                <div style="margin-top: 4px" v-show="position > 700">
                    <SanPhamTabs />
                </div>
            </Transition>
        </div>
    </a-layout-header>
</template>

<script>
import IMenu from '@/components/menu/menu';
import SanPhamTabs from '@/pages/quan-ly-bao-gia/BaoGia/ChiTietBaoGia/SanPhamTabs';
import { mapActions, mapMutations, mapState } from 'vuex';
import HeaderAvatar from './HeaderAvatar';
import { Modal } from 'ant-design-vue';
import _ from 'lodash';

export default {
    name: 'AdminHeader',
    components: { IMenu, HeaderAvatar, SanPhamTabs },
    props: ['collapsed', 'menuData'],
    data() {
        return {
            searchActive: false,
            position: 0
        };
    },
    computed: {
        ...mapState('setting', [
            'theme',
            'isMobile',
            'layout',
            'systemName',
            'lang',
            'pageWidth',
            'shouldGeneralGuideBeVisible',
            'templateGuideVisibility'
        ]),
        ...mapState('window', ['width']),
        ...mapState('baoGia', ['baoGia', 'baoGiaSaved']),
        headerTheme() {
            if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
                return 'light';
            }
            return this.theme.mode;
        },
        langAlias() {
            let lang = this.langList.find((item) => item.key == this.lang);
            return lang.alias;
        },
        menuWidth() {
            const { layout, searchActive } = this;
            const headWidth = layout === 'head' ? '100% - 188px' : '100%';
            const extraWidth = searchActive ? '600px' : '400px';
            return `calc(${headWidth} - ${extraWidth})`;
        }
    },
    watch: {
        $route(to, from) {
            if (to.path === '/quan-ly-bao-gia')
                document
                    .getElementById('popContainer')
                    .addEventListener('scroll', this.handleScroll);
            if (from.path === '/quan-ly-bao-gia') {
                document
                    .getElementById('popContainer')
                    .removeEventListener('scroll', this.handleScroll);
                this.resetBaoGia();
                this.resetBaoGiaSaved();
                this.position = 0;
            }
        }
    },
    methods: {
        ...mapActions('baoGia', ['resetBaoGia', 'resetBaoGiaSaved']),
        toggleCollapse() {
            this.$emit('toggleCollapse');
        },
        onSelect(obj) {
            this.$emit('menuSelect', obj);
        },
        ...mapMutations('setting', ['setLang', 'setGeneralGuideVisibility']),
        toggleGeneralGuideVisibility() {
            this.setGeneralGuideVisibility(!this.shouldGeneralGuideBeVisible);
        },
        handleScroll() {
            this.position = document.getElementById('popContainer').scrollTop;
        },
        async returnBaoGia() {
            const self = this;
            let baoGia = await self.baoGia;
            let baoGiaSaved = await self.baoGiaSaved;
            delete baoGia.createdAt;
            delete baoGia.updatedAt;
            delete baoGia.expiredTime;
            delete baoGiaSaved.createdAt;
            delete baoGiaSaved.updatedAt;
            delete baoGiaSaved.expiredTime;
            if (!baoGiaSaved.id || !_.isEqual(baoGia, baoGiaSaved)) {
                Modal.confirm({
                    title: 'Chưa lưu báo giá?',
                    content: 'Bạn có chắc muốn rời đi',
                    onOk() {
                        self.resetBaoGia();
                        self.resetBaoGiaSaved();
                    },
                    onCancel() {
                        return;
                    },
                    class: 'test'
                });
            } else {
                self.resetBaoGia();
                self.resetBaoGiaSaved();
            }
        }
    },
    mounted() {
        if (this.$route.path === '/quan-ly-bao-gia')
            document.getElementById('popContainer').addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        document.getElementById('popContainer').removeEventListener('scroll', this.handleScroll);
    }
};
</script>

<style lang="less" scoped>
@import 'index';
</style>
