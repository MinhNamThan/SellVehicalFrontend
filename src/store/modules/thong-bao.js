import apiService from '@/services/thong-bao';

export default {
    namespaced: true,
    state: {
        listThongBao: [],
        metaData: {}
    },
    getters: {},
    actions: {
        async saveThongBao(context, body) {
            const res = await apiService.saveThongBao(body);
            return res.data;
        },
        async updateThongBao(context, body) {
            await apiService.updateThongBao(body);
        },
        async getListThongBao(context, params) {
            const { data } = await apiService.getListThongBao(params);
            context.commit('setThongBaoList', data.items);
            context.commit('setMetaData', data.metadata);
        },
        async deleteThongBao(context, id) {
            await apiService.deleteThongBao(id);
        },
        async uploadHinhAnh(context, body) {
            const res = await apiService.uploadHinhAnh(body);
            return res.data;
        }
    },
    mutations: {
        setThongBaoList(state, list) {
            state.listThongBao = list;
        },
        setMetaData(state, obj) {
            state.metaData = obj;
        }
    }
};
