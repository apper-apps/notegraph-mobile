import { useEffect } from 'react'

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK
        ApperUI.showResetPassword('#authentication-reset-password')
    }, [])

return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-6">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293A6 6 0 0118 7z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900 font-display">Reset Password</h1>
                            <p className="text-gray-600">Enter your new password below</p>
                        </div>
                    </div>
                    
                    <div id="authentication-reset-password"></div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword