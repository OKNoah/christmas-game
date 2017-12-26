// @flow

import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
// import { autobind } from 'core-decorators'
import { bindActionCreators } from 'redux'
import { keysIn } from 'lodash'
import keydown, { keydownScoped } from 'react-keydown'

import Player from '../components/Player'
import { getPlayers } from '../redux/modules/players'
import initStore from '../redux'
import { moveUp, moveDown, moveLeft, moveRight } from '../redux/modules/players'

type Props = {
  getPlayers: Function,
  isLoaded: Boolean,
  url: Object,
  players: Object
};

const xOffset = 15
const yOffset = 15

@withRedux(
  initStore,
  (state) => ({
    players: state.players.data,
    isLoaded: state.players.loaded
  }),
  (dispatch) => bindActionCreators({
    getPlayers,
    moveUp,
    moveLeft,
    moveDown,
    moveRight
  }, dispatch)
)
@keydown('W', 'A', 'S', 'D')
export default class Index extends Component<Props> {
  // controlled = {}

  static defaultProps = {
    players: {}
  }

  componentWillMount () {
    const { url: { query: { color } } } = this.props

    if (color && !this.props.isLoaded) {
      this.props.getPlayers(color)
    }
  }

  componentDidMount () {
    if (typeof window === 'object') {
      document.body.style.backgroundImage = 'url(/static/background.gif)'
      document.body.style.backgroundColor = 'green'
      document.body.style.padding = '15px'
    }
  }

  // componentWillUpdate (newProps) {
  //   const { url: { query: { color } } } = this.props
  //   const newP = newProps.players[color]
  //   const oldP = this.props.players[color]

  //   if (!Array.isArray(oldP)) {
  //     return
  //   }

  //   if (newP !== oldP) {
  //     const x = oldP[0] - newP[0]
  //     const y = oldP[1] - newP[1]

  //     if (x !== 0) this.move('x', x)
  //     if (y !== 0) this.move('y', y)
  //   }
  // }

  @keydownScoped('S')
  moveUp () {
    // this.move('y', +1)
    this.props.moveUp()
  }

  @keydownScoped('W')
  moveDown () {
    // this.move('y', -1)
    this.props.moveDown()
  }

  @keydownScoped('A')
  moveLeft () {
    // this.move('x', -1)
    this.props.moveLeft()
  }

  @keydownScoped('D')
  moveRight () {
    // this.move('x', +1)
    this.props.moveRight()
  }

  /*
    This was an attemp at adding some animation, but the server just updates way too quickly for it to work. I would think about seperating the characters within different stores and doing debounce, or some other crap.
  */
  // move(axis, value) {
  //   const index = axis === 'x' ? 0 : 1
  //   const { url: { query: { color } } } = this.props
  //   if (this && this.rect && this.rect.to) {
  //     const command = { [index ? 'y' : 'x']: this.props.players[color][index] + (value ? +xOffset : -xOffset) }
  //     // const command = { [index ? 'offsetY' : 'offsetX']: value * yOffset }

  //     console.log('command', command)
  //     this.rect.to({
  //       ...command,
  //       duration: 0.05
  //     })
  //   }
  // }

  render () {
    const { url: { query: { color } } } = this.props
    const width = 750
    const height = 750

    if (typeof window === 'object') {
      const { Stage, Layer, Rect } = require('react-konva')

      return (
        <div>
          <style jsx>{`
            div {
              background: red;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            @media (max-width: 600px) {
              div {
                background: blue;
              }
            }
          `}</style>
          <Stage
            ref="Stage"
            width={width}
            height={height}
          >
            <Layer>
              <Rect
                width={width}
                height={height}
                x={0}
                y={0}
                fill="#EFEFEF"
              />
              {this.props.isLoaded && keysIn(this.props.players).map((player) => {
                const [x, y] = this.props.players[player]

                if (player) {
                  return (
                    <Player
                      key={player + x + y}
                      name={player}
                      x={(x * xOffset) || 1}
                      y={(y * yOffset) || 1}
                      isControlled={player === color}
                    />
                  )
                }
              })}
            </Layer>
          </Stage>
        </div>
      )
    }

    return null
  }
}
