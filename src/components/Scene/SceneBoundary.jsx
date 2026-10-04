import React from 'react'
import SceneFallback from './SceneFallback'
export default class SceneBoundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children }
}
