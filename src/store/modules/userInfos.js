import { Local, Session } from '@/utils/storage.js';

const userInfosModule = {
	namespaced: true,
	state: {
		userInfos: {},
	},
	mutations: {
		// 设置用户信息
		getUserInfos(state, data) {
			state.userInfos = data;
		},
	},
	actions: {
		// 设置用户信息
		async setUserInfos({ commit }, data) {
			if (data) {
				commit('getUserInfos', data);
			} else {
				if (Local.get('userInfo') == null) {
					if (Session.get('userInfo')) commit('getUserInfos', Session.get('userInfo'));

				} else {
					if (Local.get('userInfo')) commit('getUserInfos', Local.get('userInfo'));

				}
			}
		},
	},
};

export default userInfosModule;
