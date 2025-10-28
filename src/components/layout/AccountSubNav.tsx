import { NavLink } from 'react-router-dom'
import { FaRegHeart, FaRegUser } from 'react-icons/fa'
import { CiDeliveryTruck } from 'react-icons/ci'
import { RiKey2Line } from 'react-icons/ri'
import { BsCart4 } from 'react-icons/bs'
import { useStoreDispatch } from '../../store'
import { logOut } from '../../store/slices/authSlice'
import { MouseEvent } from 'react'
import { TbLogout } from 'react-icons/tb'

const AccountSubNav = () => {
  const dispatch = useStoreDispatch()


    const logOutHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(logOut())
      }

    return (
        <nav className='flex text-xs md:text-sm flex-col gap-y-2 md:gap-y-4 xl:gap-y-8 sticky top-[100px] lg:static'>
            <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : 'text-slate-600') + `  px-3 md:px-6 py-2 rounded flex gap-x-2 md:gap-x-4 items-center`} to="/account/orders"><BsCart4 className='w-5 h-5' /> Orders</NavLink>

            <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : 'text-slate-600') + `  px-3 md:px-6 py-2 rounded flex gap-x-2 md:gap-x-4 items-center`} to="/account/wishlist"><FaRegHeart className='w-4 h-4' /> Wishlist</NavLink>

            <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : 'text-slate-600') + `  px-3 md:px-6 py-2 rounded flex gap-x-2 md:gap-x-4 items-center`} to="/account/address"><CiDeliveryTruck className='w-6 h-6' /> Address</NavLink>

            <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : 'text-slate-600') + `  px-3 md:px-6 py-2 rounded flex gap-x-2 md:gap-x-4 items-center`} to="/account/change-password"><RiKey2Line className='w-5 h-5' />  Password</NavLink>

            <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : 'text-slate-600') + `  px-3 md:px-6 py-2 rounded flex gap-x-2 md:gap-x-4 items-center`} to="/account/details"><FaRegUser className='w-4 h-4' /> Account Detail</NavLink>

            <button onClick={logOutHandler} className=' px-3 md:px-6 py-2 rounded flex gap-x-2 md:gap-x-4 items-center text-slate-600'><TbLogout className='w-4 h-4' /> Log Out</button>

        </nav>
    )
}

export default AccountSubNav