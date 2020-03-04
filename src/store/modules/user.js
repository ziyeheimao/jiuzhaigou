export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    shopId: null,
    createUserId: null,
    userId: null
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateShopId (state, shopId) {
      state.shopId = shopId
    },
    updateUserId (state, userId) {
      state.userId = userId
    },
    updateCreateUserId (state, createUserId) {
      state.createUserId = createUserId
    },
    updateUrlType (state, type) {
      state.type = type
    }
  }
}
