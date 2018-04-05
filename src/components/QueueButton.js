import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { updateSeriesQueue } from '../actions'

import { Button, Badge } from 'reactstrap'

import classNames from 'classnames'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faMinus from '@fortawesome/fontawesome-free-solid/faMinus'

class QueueButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inQueue: false
    }
    this.handle = this.handle.bind(this)
  }

  // update each time the props are updated
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.inQueue !== prevState.inQueue) {
      return {
        inQueue: nextProps.inQueue
      }
    }
  }

  async handle (e) {
    e.preventDefault()
    const { inQueue } = this.state
    const { dispatch, id } = this.props
    try {
      await dispatch(updateSeriesQueue({ id, inQueue }))
      this.setState({ inQueue: !inQueue })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { inQueue } = this.state
    // grab some unnecessary props to make them not go into the tag (because of ...props)
    const { dispatch, series, id, badge, inQueue: isInQueue, className, ...props } = this.props

    let Tag, attrs
    if (badge) {
      Tag = Badge
      attrs = {
        ...props,
        href: '#'
      }
    } else {
      Tag = Button
      attrs = props
    }
    return (
      <Tag color='light' onClick={this.handle} className={classNames(className, {
        'text-danger': inQueue,
        'text-success': !inQueue
      })} {...attrs}>
        {inQueue
          ? <Fragment><FontAwesomeIcon icon={faMinus} /> Remove from Queue</Fragment>
          : <Fragment><FontAwesomeIcon icon={faPlus} /> Add to Queue</Fragment>}
      </Tag>
    )
  }
}

export default connect((store, props) => {
  const { id } = props
  const currentSeries = store.Data.series[id]
  return {
    inQueue: currentSeries && currentSeries.in_queue
  }
})(QueueButton)
