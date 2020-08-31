import { createStore } from 'redux'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

const initialState = { lang: 'enUS', segment: 'market', cart: [], orderInfo: {}, token: {} }
// create your reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOKEN':
      return { ...state, token: action.payload }
    case 'LANG':
      return { ...state, lang: action.payload }
    case 'SEGMENT':
      return { ...state, segment: action.payload }
    case 'CART_ADD':
      return {
        ...state,
        cart: [action.payload].concat(state.cart ? state.cart : [])
      }
    case 'CART_REMOVE':
      return {
        ...state,
        cart: state.cart.filter(
          (item, index) => index !== Number(action.payload)
        )
      }
    case 'CART_CLEAR':
      return {
        ...state,
        cart: []
      }
    case 'INFO_UPDATE':
      return {
        ...state,
        orderInfo: action.payload
      }
    default:
      return state
  }
}

// create a makeStore function
const makeStore = context => createStore(reducer)

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true })
