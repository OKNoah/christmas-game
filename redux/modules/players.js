const GET_PLAYERS = 'redux/saves/GET_PLAYERS'
const GET_PLAYERS_SUCCESS = 'redux/saves/GET_PLAYERS_SUCCESS'
// const GET_PLAYERS_FAILURE = 'redux/saves/GET_PLAYERS_FAILURE'

const initialState = {
  loaded: false,
  data: {}
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case GET_PLAYERS:
      return {
        ...state,
        loaded: false
      };

    case GET_PLAYERS_SUCCESS:
      return {
        ...state,
        ...action.result,
        loaded: true
      };

    default:
      return state;
  }
}

let ws = function () { return 1 }

export function getPlayers (color) {
  return function (dispatch) {
    dispatch({ type: GET_PLAYERS })

    if (typeof window === 'object') {
      ws = new window.WebSocket(`ws://192.168.0.17:3001/map/1/player/${color}`)

      if (ws) {
        ws.addEventListener('message', (message) => {
          dispatch({ type: GET_PLAYERS_SUCCESS, result: JSON.parse(message.data) })
        })
      }
    }
  }
}

export function moveRight () {
  ws.send('moveRight')
  return () => {}
}

export function moveUp () {
  ws.send('moveUp')
  return () => {}
}

export function moveDown () {
  ws.send('moveDown')
  return () => {}
}

export function moveLeft () {
  ws.send('moveLeft')
  return () => {}
}
