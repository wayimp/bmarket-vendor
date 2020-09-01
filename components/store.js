import { createStore } from 'redux'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

const initialState = {
  lang: 'enUS',
  segment: 'orders',
  bvendors: [],
  token: {}
}
// create your reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOKEN':
      return { ...state, token: action.payload }
    case 'LANG':
      return { ...state, lang: action.payload }
    case 'SEGMENT':
      return { ...state, segment: action.payload }
    case 'BVENDORS':
      return { ...state, bvendors: action.payload }
    default:
      return state
  }
}

// create a makeStore function
const makeStore = context => createStore(reducer)

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true })
