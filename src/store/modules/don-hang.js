import apiService from '@/services/don-hang';

export default {
    namespaced: true,
    state: {
        listDonHang: [],
        donHang: {},
        metadata: {}
    },
    getters: {},
    actions: {
        async saveDonHang(context, body) {
            const { data } = await apiService.saveDonHang(body);
            context.commit('setDonHang', { ...context.state.donHang, ...data });
        },
        async updateDonHang(context, body) {
            await apiService.updateDonHang(body);
        },
        async getListDonHang(context, params) {
            const { data } = await apiService.getListDonHang(params);
            let listDonHang = data.items.map((donHang) => {
                let listSanPham = donHang.items.map((item) =>
                    item.chietKhau ? item : { ...item, chietKhau: { unit: '%', value: 0 } }
                );
                return { ...donHang, listSanPham };
            });
            listDonHang.sort((a, b) => {
                let da = new Date(a.updatedAt),
                    db = new Date(b.updatedAt);
                return db - da;
            });
            context.commit('setDonHangList', listDonHang);
            context.commit('setMetadata', data.metadata);
        },
        async deleteDonHang(context, id) {
            await apiService.deleteDonHang(id);
        },
        resetDonHang(context) {
            context.commit('setDonHang', {});
        },
        selectDonHang(context, donHang) {
            context.commit('setDonHang', { ...donHang, activeKey: null });
        },
        addKhachHangMuaHang(context, khachHang) {
            const donHang = { ...context.state.donHang, khachHangId: khachHang.id, khachHang };
            context.commit('setDonHang', donHang);
        },
        deleteKhachHangMuaHang(context) {
            const donHang = { ...context.state.donHang, khachHangId: null, khachHang: {} };
            context.commit('setDonHang', donHang);
        },
        addSanPhamDonHang(context, { sanPham }) {
            const listSanPham = context.state.donHang.items;
            let id = 0;
            if (listSanPham.length > 0)
                listSanPham.forEach((item) => {
                    if (item.id > id) id = item.id;
                });
            listSanPham.unshift({ ...sanPham, sanPhamId: sanPham.id, id: id + 1 });
            const donHang = { ...context.state.donHang, items: listSanPham };
            context.commit('setDonHang', donHang);
        },
        deleteSanPhamDonHang(context, { id }) {
            const oldListSanPham = context.state.donHang.items;
            const newListSanPham = oldListSanPham.filter((item) => item.id !== id);
            const donHang = { ...context.state.donHang, items: newListSanPham };
            context.commit('setDonHang', donHang);
        },
        resetListSanPhamDonHang(context) {
            const donHang = { ...context.state.donHang, items: [] };
            context.commit('setDonHang', donHang);
        },
        addDaiLyBanHang(context, daiLy) {
            const donHang = { ...context.state.donHang, agentId: daiLy.id };
            context.commit('setDonHang', donHang);
        },
        resetDaiLyBanHang(context) {
            const donHang = { ...context.state.donHang, agentId: null };
            context.commit('setDonHang', donHang);
        }
    },
    mutations: {
        setDonHangList(state, list) {
            state.listDonHang = list;
        },
        setMetadata(state, metadata) {
            state.metadata = metadata;
        },
        setDonHang(state, donHang) {
            state.donHang = donHang;
        }
    }
};
