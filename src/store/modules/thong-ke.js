import apiService from '@/services/thong-ke';

export default {
    namespaced: true,
    state: {
        listThongKe: []
    },
    getters: {},
    actions: {
        async getListThongKe(context, { from, to }) {
            const { data } = await apiService.getListThongKe({ from, to });
            context.commit('setThongKeList', data);
        }
    },
    mutations: {
        setThongKeList(state, list) {
            state.listThongKe = list;
        }
    }
};
