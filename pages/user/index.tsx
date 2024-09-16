import React from 'react';
import withAuthUser from '../../hoc/withAuthUser';
const User = () => {
    return (
        <>
            <h1>Home User</h1>
        </>
    )
  }
export default withAuthUser(User);