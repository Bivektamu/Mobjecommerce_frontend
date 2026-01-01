
import { RouterProvider } from "react-router-dom"
import router from "./router"
import { useStoreDispatch } from "./store"
import { useEffect } from "react"
import { getAuthStatus } from "./store/slices/authSlice"
function App() {

  const dispatch = useStoreDispatch()

  useEffect(() => {
    dispatch(getAuthStatus())
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
