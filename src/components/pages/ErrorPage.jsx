import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || 'An error occurred'
  
return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft border border-red-100 p-8 text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 font-display">Authentication Error</h1>
              <p className="text-gray-600">{errorMessage}</p>
            </div>
          </div>
          
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage