import {  useEffect } from 'react'
import { getAuthStatus, useAuth } from '../store/slices/authSlice'
import { Outlet, useNavigate } from 'react-router-dom'
import { Status, Role } from '../store/types'
import { useStoreDispatch } from '../store'
import ProgressLoader from '../components/ui/ProgressLoader'
// import Preloader from '../components/ui/Preloader'

// type Props = {
//     children: ReactNode
// }
const Private = () => {
// const Private = ({ children }: Props) => {

    const navigate = useNavigate()

    const { isLoggedIn, status, user } = useAuth()
    const dispatch = useStoreDispatch()

    useEffect(() => {
        if (status === Status.IDLE)
            dispatch(getAuthStatus())
    }, [status, dispatch])

    useEffect(() => {
        if (status === Status.FULFILLED && !isLoggedIn) {
            // console.log('saf');

            navigate('/')
        }
        else if (status === Status.REJECTED) {
            // console.log('saf');
            navigate('/')
        }

    }, [isLoggedIn, status])

    useEffect(() => {

        if (user && user.role !== Role.CUSTOMER) {
            navigate('/')
        }
    }, [user])

    return (
        <>
            {
                status !== Status.FULFILLED ?
                    (<ProgressLoader cssClass='mt-32' />) :
                    <Outlet />
            }

        </>
    )
}

export default Private