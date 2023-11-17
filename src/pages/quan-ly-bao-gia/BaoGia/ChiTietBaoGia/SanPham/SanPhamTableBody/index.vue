<template>
    <Draggable v-model="list" tag="tbody" ghostClass="dragging-row" v-if="permission.modifiable">
        <slot />
    </Draggable>
    <tbody v-else>
        <slot />
    </tbody>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Draggable from 'vuedraggable';

export default {
    name: 'SanPhamTableBody',
    components: { Draggable },
    inject: ['phongId', 'permission'],
    computed: {
        ...mapState('baoGia', ['baoGia']),
        list: {
            get() {
                return this.baoGia.items.find((item) => item.id === this.phongId).listSanPham;
            },
            set(value) {
                this.setListSanPhamBaoGia({ phongId: this.phongId, listSanPham: value });
            }
        }
    },
    methods: {
        ...mapActions('baoGia', ['setListSanPhamBaoGia'])
    }
};
</script>
