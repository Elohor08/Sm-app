import React from 'react'
import FriendRequest from './FriendRequests'
import MessageList from './MessageList'

const Widget = () => {
  return (
    <section className="widgets">
      <FriendRequest/>
      <MessageList/>
    </section>
  )
}

export default Widget