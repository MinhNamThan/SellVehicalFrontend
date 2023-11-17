import apiService from '@/services/nguoi-dung';

export default {
    namespaced: true,
    state: {
        listNguoiDung: [],
        metadata: {}
    },
    getters: {},
    actions: {
        async saveNguoiDung(context, body) {
            await apiService.saveNguoiDung(body);
        },
        async updateNguoiDung(context, body) {
            await apiService.updateNguoiDung(body);
        },
        async getListNguoiDung(context, params) {
            const { data } = await apiService.getListNguoiDung(params);
            context.commit('setNguoiDungList', data.items);
            context.commit('setMetadata', data.metadata);
        },
        async deleteNguoiDung(context, id) {
            await apiService.deleteNguoiDung(id);
        }
    },
    mutations: {
        setNguoiDungList(state, list) {
            state.listNguoiDung = list;
        },
        setMetadata(state, metadata) {
            state.metadata = metadata;
        }
    }
};
