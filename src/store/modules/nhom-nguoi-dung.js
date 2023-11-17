import apiService from '@/services/nhom-nguoi-dung';

export default {
    namespaced: true,
    state: {
        listNhomNguoiDung: []
    },
    getters: {},
    actions: {
        async saveNhomNguoiDung(context, body) {
            await apiService.saveNhomNguoiDung(body);
        },
        async updateNhomNguoiDung(context, body) {
            await apiService.updateNhomNguoiDung(body);
        },
        async getListNhomNguoiDung(context) {
            const { data } = await apiService.getListNhomNguoiDung();
            context.commit('setNhomNguoiDungList', data);
        },
        async deleteNhomNguoiDung(context, id) {
            await apiService.deleteNhomNguoiDung(id);
        }
    },
    mutations: {
        setNhomNguoiDungList(state, list) {
            state.listNhomNguoiDung = list;
        }
    }
};
