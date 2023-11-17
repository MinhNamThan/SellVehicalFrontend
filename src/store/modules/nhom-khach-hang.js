import apiService from '@/services/nhom-khach-hang';

export default {
    namespaced: true,
    state: {
        listNhomKhachHang: []
    },
    getters: {},
    actions: {
        async saveNhomKhachHang(context, body) {
            await apiService.saveNhomKhachHang(body);
        },
        async updateNhomKhachHang(context, body) {
            await apiService.updateNhomKhachHang(body);
        },
        async getListNhomKhachHang(context) {
            const { data } = await apiService.getListNhomKhachHang();
            context.commit('setNhomKhachHangList', data);
        },
        async deleteNhomKhachHang(context, id) {
            await apiService.deleteNhomKhachHang(id);
        }
    },
    mutations: {
        setNhomKhachHangList(state, list) {
            state.listNhomKhachHang = list;
        }
    }
};
