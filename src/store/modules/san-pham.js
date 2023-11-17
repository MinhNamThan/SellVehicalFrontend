import apiService from '@/services/san-pham';

export default {
    namespaced: true,
    state: {
        listSanPham: []
    },
    getters: {},
    actions: {
        async importSanPham(context, formData) {
            await apiService.importSanPham(formData);
        },
        async updateSanPham(context, body) {
            await apiService.updateSanPham(body);
        },
        async getListSanPham(context) {
            const { data } = await apiService.getListSanPham();
            context.commit('setSanPhamList', data);
        },
        async saveSanPham(context, body) {
            const { data } = await apiService.saveSanPham(body);
            console.log(data);
        },
        async deleteSanPham(context, id) {
            await apiService.deleteSanPham(id);
        },
        async uploadHinhAnh(context, body) {
            const res = await apiService.uploadHinhAnh(body);
            return res.data;
        }
    },
    mutations: {
        setSanPhamList(state, list) {
            state.listSanPham = list;
        }
    }
};
