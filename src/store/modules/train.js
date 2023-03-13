export default {
    namespaced: true,
    state: {
        timer: null
    },
    mutations: {
        clearTimer(state) {
            clearInterval(state.timer)
        },
        setTimer(state, payload) {
            state.timer = payload
        }
    },
    actions: {
        clearTimerAc({ commit }) {
            commit('clearTimer')
        },
        setTimerAc({ commit }, payload) {
            commit('setTimer', payload)
        }
    },
    getters: {

    }
}