export default {
    namespaced: true,
    state: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    mutations: {
        resize(state) {
            state.width = window.innerWidth;
            state.height = window.innerHeight;
        }
    }
};
