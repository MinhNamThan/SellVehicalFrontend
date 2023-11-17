<template>
    <div>
        <a-tabs v-model="baoGia.activeKey" type="card">
            <a-tab-pane v-for="item in listPhong" :key="item.id">
                <template slot="tab">
                    <a-space :size="2" v-if="modifiable">
                        <div @dblclick="editableTab = item.id">
                            <input
                                :value="item.name"
                                disabled
                                v-show="editableTab !== item.id"
                                class="tab-name transparent-selection p-0"
                                :style="{
                                    width: `${item.name.length > 6 ? item.name.length * 8 : 56}px`
                                }"
                            />
                            <input
                                v-model="item.name"
                                @change="
                                    (e) => {
                                        onChange(item.id, e.srcElement._value);
                                    }
                                "
                                @keyup.enter="
                                    (e) => {
                                        onChange(item.id, e.srcElement._value);
                                        editableTab = null;
                                    }
                                "
                                v-focus="editableTab === item.id"
                                @focus="$event.target.select()"
                                @blur="editableTab = null"
                                @keydown.stop
                                class="tab-name p-0"
                                :style="{
                                    width: `${item.name.length > 6 ? item.name.length * 8 : 56}px`
                                }"
                                v-show="editableTab === item.id"
                            />
                        </div>
                        <a-popover>
                            <template slot="content">
                                <a-space :size="2">
                                    <a-tooltip title="Nhân bản phòng">
                                        <a-button
                                            shape="circle"
                                            icon="copy"
                                            size="small"
                                            type="primary"
                                            @click="onDuplicate(item.id)"
                                        />
                                    </a-tooltip>
                                    <a-tooltip title="Xoá phòng">
                                        <a-button
                                            shape="circle"
                                            size="small"
                                            class="link pl-2"
                                            v-show="
                                                listPhong[0].id !== item.id ||
                                                (listPhong[0].id === item.id &&
                                                    listPhong.length > 1)
                                            "
                                        >
                                            <a-button
                                                shape="circle"
                                                icon="close"
                                                size="small"
                                                type="danger"
                                                @click="confirmVisible = item.id"
                                            />
                                        </a-button>
                                    </a-tooltip>
                                </a-space>
                            </template>
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn xoá phòng này không?"
                                @confirm="onDelete(item.id)"
                                @cancel="confirmVisible = null"
                                :visible="confirmVisible === item.id"
                            >
                                <a-icon type="more" style="font-size: 12px" />
                            </a-popconfirm>
                        </a-popover>
                    </a-space>
                    <span style="margin-right: 11px" v-else>{{ item.name }}</span>
                </template>
                <slot :phongId="baoGia.activeKey" />
            </a-tab-pane>
            <template slot="tabBarExtraContent" v-if="modifiable">
                <a-button
                    icon="plus"
                    class="px-2"
                    :style="{ height: '36px' }"
                    type="primary"
                    @click="onAdd"
                    >Thêm phòng
                </a-button>
            </template>
        </a-tabs>
    </div>
</template>

<script>
import Sortable from 'sortablejs';
import { focus } from 'vue-focus';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: 'SanPhamTabs',
    directives: { focus: focus },
    data() {
        return {
            editableTab: null,
            confirmVisible: null,
            modifiable: false
        };
    },
    computed: {
        ...mapState('baoGia', ['baoGia', 'baoGiaSaved']),
        ...mapGetters('account', ['permissions']),
        listPhong() {
            return this.baoGia.items;
        }
    },
    watch: {
        baoGia(newVal, oldVal) {
            if (newVal.id !== oldVal.id) this.baoGia.activeKey = this.listPhong[0].id;
        }
    },
    methods: {
        ...mapActions('baoGia', [
            'addPhong',
            'editPhong',
            'sortPhong',
            'deletePhong',
            'duplicatePhong'
        ]),
        onAdd() {
            this.addPhong();
            this.baoGia.activeKey = this.listPhong[this.listPhong.length - 1].id;
            this.$notification['success']({
                message: 'Thêm phòng thành công'
            });
        },
        onChange(id, name) {
            this.editPhong({ id, name });
        },
        onSort({ newIndex, oldIndex }) {
            this.sortPhong({ newId: newIndex, oldId: oldIndex });
        },
        onDuplicate(id) {
            this.duplicatePhong(id);
            this.$notification['success']({
                message: 'Nhân bản phòng thành công'
            });
        },
        onDelete(id) {
            this.deletePhong(id);
            if (this.baoGia.activeKey === id) this.baoGia.activeKey = this.listPhong[0].id;
            this.confirmVisible = null;
            this.$notification['success']({
                message: 'Xóa phòng thành công'
            });
        }
    },
    mounted() {
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.baoGia.activeKey = this.listPhong[0].id;
        this.baoGiaSaved.activeKey = this.listPhong[0].id;
        if (this.modifiable)
            setTimeout(
                () =>
                    Sortable.create(this.$el.querySelector('.ant-tabs-nav').firstChild, {
                        ghostClass: 'dragging-row',
                        onEnd: this.onSort
                    }),
                0
            );
    }
};
</script>

<style lang="less" scoped>
.tab-name {
    border: 0;
    background: transparent;
    &:focus {
        outline: none;
    }
    &:hover {
        cursor: pointer;
    }
}
.transparent-selection::selection {
    background-color: transparent;
    color: inherit;
}
.link {
    border: 0;
    box-shadow: none;
    background: transparent;
}
</style>
