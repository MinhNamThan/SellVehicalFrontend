import apiService from '@/services/khach-hang-theo-nhom';

export default {
    namespaced: true,
    state: {
        listKhachHangTheoNhom: []
    },
    getters: {},
    actions: {
        async saveKhachHangTheoNhom(context, params) {
            await apiService.saveKhachHangTheoNhom(params.groupId, params.data);
        },
        async getListKhachHangTheoNhom(context, groupId) {
            const { data } = await apiService.getListKhachHangTheoNhom(groupId);
            context.commit('setKhachHangTheoNhomList', data);
        },
        async deleteKhachHangTheoNhom(context, params) {
            await apiService.deleteKhachHangTheoNhom(params.groupId, params.customerId);
        }
    },
    mutations: {
        setKhachHangTheoNhomList(state, list) {
            state.listKhachHangTheoNhom = list;
        }
    }
};
