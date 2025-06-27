import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

function Login() {
  const { isInitialized } = useContext(AuthContext);
  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin("#authentication")
    }
  }, [isInitialized])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-8">
          <div className="flex flex-col gap-6 items-center justify-center">
            <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 text-white text-2xl font-bold shadow-lg">
              N
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="text-center text-2xl font-bold text-gray-900 font-display">
                Sign in to NoteGraph
              </div>
              <div className="text-center text-gray-600">
                Welcome back, please sign in to continue
              </div>
            </div>
          </div>
          
          <div id="authentication" />
          
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login