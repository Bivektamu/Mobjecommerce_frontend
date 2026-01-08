import {  useGoogleLogin } from "@react-oauth/google"
import { useCallback, useState } from "react"

const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const loginHandler = useGoogleLogin({
        onSuccess: (response) => {
            setData(response.access_token)
            setTimeout(()=>setLoading(false), 1000)
            
        },
        onError: () => {
            setError('Google sign in error')
            setLoading(false)

        },
        onNonOAuthError: () => {
            setError('Google sign in error')
            setLoading(false)

        }
    })

    const login = useCallback(() => {
        setLoading(true)
        return loginHandler()
    }, [loginHandler])

    return { login, loading, data, error}
}

export default useGoogleAuth