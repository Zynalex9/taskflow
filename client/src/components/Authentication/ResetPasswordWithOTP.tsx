import React from 'react'
import { useLocation } from 'react-router-dom'

const ResetPasswordWithOTP = () => {
    const location = useLocation()
    const otp = location.state.otp 
  return (
    <div>
{otp}        hello
    </div>
  )
}

export default ResetPasswordWithOTP
