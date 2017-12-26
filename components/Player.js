// @flow
import React, { Component } from 'react'
import { Rect } from 'react-konva'

const xOffset = 50
const yOffset = 50

type Props = {
  x: Number,
  y: Number,
  name: String,
  isControlled: Boolean
};

export default class Player extends Component<Props> {
  rect = {}
  state = { image: new window.Image() }

  to (options) {
    this.rect.to(options)
  }

  render () {
    return (
      <Rect
        ref={(ref) => { this.rect = ref }}
        width={15}
        height={15}
        x={this.props.x}
        y={this.props.y}
        fill={this.props.name || 'brown'}
      />
    )
  }
}
