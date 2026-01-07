import { useEffect } from 'react'
import { getAuthStatus, useAuth } from '../store/slices/authSlice'
import { Outlet, useNavigate } from 'react-router-dom'
import { Status, Role } from '../store/types'
import { useStoreDispatch } from '../store'
import Preloader from '../components/ui/Preloader'

const Private = () => {
    // const Private = ({ children }: Props) => {

    const navigate = useNavigate()

    const { isLoggedIn, status, user } = useAuth()
    const dispatch = useStoreDispatch()

    useEffect(() => {
        if (status === Status.IDLE)
            dispatch(getAuthStatus())
        else if (status === Status.REJECTED) {
            return navigate('/')
        }
        else if (status === Status.FULFILLED) {
            if (!isLoggedIn) {
                return navigate('/')
            }
            else if (!user || user?.role !== Role.CUSTOMER) {
                return navigate('/')
            }
        }
    }, [status, dispatch, navigate, isLoggedIn, user])


    if (status === Status.PENDING || !user || user?.role !== Role.CUSTOMER) {
        return <Preloader />
    }

    return (
        <Outlet />

    )
}

export default Private