
import { RouterProvider } from "react-router-dom"
import router from "./router"
import { useStoreDispatch } from "./store"
import { useEffect } from "react"
import { getAuthStatus } from "./store/slices/authSlice"
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {


  const dispatch = useStoreDispatch()

  useEffect(() => {
    dispatch(getAuthStatus())
  }, [])

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  )
}

export default App
