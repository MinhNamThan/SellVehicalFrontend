import apiService from '@/services/khach-mua-hang';

export default {
    namespaced: true,
    state: {
        listKhachMuaHang: []
    },
    getters: {},
    actions: {
        async saveKhachMuaHang(context, params) {
            const { data } = await apiService.saveKhachMuaHang(params);
            if (context.rootState.baoGia.baoGia.status) {
                const baoGia = {
                    ...context.rootState.baoGia.baoGia,
                    khachHangId: data.id,
                    khachHang: data
                };
                context.commit('baoGia/setBaoGia', baoGia, { root: true });
            } else {
                const donHang = {
                    ...context.rootState.donHang.donHang,
                    khachHangId: data.id,
                    khachHang: data
                };
                context.commit('donHang/setDonHang', donHang, { root: true });
            }
        },
        async updateKhachMuaHang(context, params) {
            const { data } = await apiService.updateKhachMuaHang(params);
            if (context.rootState.baoGia.baoGia.status) {
                const baoGia = {
                    ...context.rootState.baoGia.baoGia,
                    khachHangId: data.id,
                    khachHang: data
                };
                context.commit('baoGia/setBaoGia', baoGia, { root: true });
            } else {
                const donHang = {
                    ...context.rootState.donHang.donHang,
                    khachHangId: data.id,
                    khachHang: data
                };
                context.commit('donHang/setDonHang', donHang, { root: true });
            }
        },
        async getListKhachMuaHang(context, search) {
            const { data } = await apiService.getListKhachMuaHang(search);
            context.commit('setKhachMuaHangList', data);
        },
        async deleteKhachMuaHang(context, id) {
            await apiService.deleteKhachMuaHang(id);
            if (context.rootState.baoGia.baoGia.khachHangId === id) {
                const baoGia = {
                    ...context.rootState.baoGia.baoGia,
                    khachHangId: null,
                    khachHang: {}
                };
                context.commit('baoGia/setBaoGia', baoGia, { root: true });
            }
        }
    },
    mutations: {
        setKhachMuaHangList(state, list) {
            state.listKhachMuaHang = list;
        }
    }
};
