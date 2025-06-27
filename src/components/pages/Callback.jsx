import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showSSOVerify("#authentication-callback")
  }, [])
  
return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 font-display">Completing Sign In</h1>
              <p className="text-gray-600">Please wait while we verify your authentication...</p>
            </div>
          </div>
          
          <div id="authentication-callback"></div>
        </div>
      </div>
    </div>
  )
}

export default Callback