import apiService from '@/services/khach-hang';

export default {
    namespaced: true,
    state: {
        listKhachHang: [],
        metadata: {}
    },
    getters: {},
    actions: {
        async updateKhachHang(context, body) {
            await apiService.updateKhachHang(body);
        },
        async getListKhachHang(context, params) {
            const { data } = await apiService.getListKhachHang(
                params.per,
                params.page,
                params.search
            );
            context.commit('setKhachHangList', data.items);
            context.commit('setMetadata', data.metadata);
        },
        async kickOutKhachHang(context, id) {
            await apiService.kickOutKhachHang(id);
        },
        async swapKhachHang(context, params) {
            await apiService.swapKhachHang(params);
        },
        async deleteKhachHang(context, id) {
            await apiService.deleteKhachHang(id);
        }
    },
    mutations: {
        setKhachHangList(state, list) {
            state.listKhachHang = list;
        },
        setMetadata(state, metadata) {
            state.metadata = metadata;
        }
    }
};
