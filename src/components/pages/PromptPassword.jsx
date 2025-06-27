import { useEffect } from 'react'

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK
        ApperUI.showPromptPassword('#authentication-prompt-password')
    }, [])

return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-6">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900 font-display">Set Password</h1>
                            <p className="text-gray-600">Please set your password to continue</p>
                        </div>
                    </div>
                    
                    <div id="authentication-prompt-password"></div>
                </div>
            </div>
        </div>
    )
}

export default PromptPassword