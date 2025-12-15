import { useEffect, useState } from 'react'

import { getAuthStatus, useAuth } from '../../store/slices/authSlice'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/AdminSidebar'
import BreadCrumbs from '../../components/layout/BreadCrumbs'

import { useToasts } from "../../store/slices/toastSlice"
import ToastComponent from "../../components/ui/Toast"
import { Status, Role } from '../../store/types'
import { useStoreDispatch } from '../../store'
import Preloader from '../../components/ui/Preloader'
import AdminLogo from '../../components/ui/AdminLogo'

const PrivateRoute = () => {
    const navigate = useNavigate()
    const allToasts = useToasts()
    const auth = useAuth()
    const { isLoggedIn, status, authUser } = auth
    const dispatch = useStoreDispatch()
    const { pathname } = useLocation()

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (status === Status.IDLE) {
            dispatch(getAuthStatus())
            return
        }
        if (status === Status.REJECTED) {
            navigate('/admin/login')
            return
        }
        if (status === Status.FULFILLED) {
            if (!isLoggedIn || (isLoggedIn && authUser?.role !== Role.ADMIN)) {
                navigate('/admin/login')
                return
            }
        }
    }, [status, dispatch, navigate, isLoggedIn, authUser])


    useEffect(() => {
        setIsOpen(false)
        if (pathname === '/admin' || pathname === '/admin/') {
            return navigate('/admin/dashboard')
        }
    }, [pathname, navigate])

    if (status !== Status.FULFILLED) return <Preloader />

    return (
        <div className='admin-wrapper pt-12 md:pt-0'>

            {
                allToasts?.length > 0 && <ToastComponent toasts={allToasts} />
            }
            <header className='px-4 py-2 flex items-center justify-between md:hidden fixed top-0 left-0 w-full bg-white z-10'>
                <AdminLogo />
                <button type="button" id='burger-menu' className={`lg:hidden ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                </button>
            </header>

            <Sidebar isOpen={isOpen} />

            <section className="w-full pl-4  md:pl-[200px] lg:pl-[240px] xl:pl-[340px] pb-4 lg:pb-12 xl:pr-12 pr-4 pt-8">
                <div className="h-[72px] flex items-center mb-12 justify-between">
                    <BreadCrumbs />
                </div>
                <Outlet />
            </section>

        </div>
    )
}

export default PrivateRoute