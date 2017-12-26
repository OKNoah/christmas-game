import { createStore, applyMiddleware, combineReducers } from 'redux'
import { ApiClient, clientMiddleware } from './ApiClient'
import remoteDevTools from 'remote-redux-devtools'
import players from './modules/players'

const {
  DEVTOOLS,
  DEVTOOLS_PORT,
  DEVTOOLS_HOST
} = process.env

const reducer = combineReducers({
  players
})

const initStore = (state) => {
  const client = new ApiClient()
  const middlewares = [clientMiddleware(client)]
  const storeCreator = applyMiddleware(...middlewares)(createStore)

  return storeCreator(
    reducer,
    state,
    DEVTOOLS ? remoteDevTools({
      name: 'christmas-game',
      realtime: true,
      hostname: DEVTOOLS_HOST || 'localhost',
      port: DEVTOOLS_PORT || 3001
    }) : undefined
  )
}

export default initStore
