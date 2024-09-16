import React from 'react';
import withAuthAdmin from '../../hoc/withAuthAdmin';
const Admin = () => {
    return (
        <>
            <h1>Home Admin</h1>
        </>
    )
  }

export default withAuthAdmin(Admin);