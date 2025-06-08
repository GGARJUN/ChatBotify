import ProfilePage from '@/components/ProfileComponents/ProfilePage'
import ResetPassword from '@/components/ProfileComponents/ResetPassword'
import Subscription from '@/components/ProfileComponents/Subscription'
import React from 'react'

function Profile() {
    return (
        <>
            <ProfilePage />
            <ResetPassword />
            <Subscription />
        </>
    )
}

export default Profile