import Logo from '../ui/Logo'
import Search from './Search'

import { useProduct } from '../../store/slices/productSlice'
import { Role } from '../../store/types'
import { logOut, useAuth } from '../../store/slices/authSlice'
import { MouseEvent, useEffect } from 'react'
import { useStoreDispatch } from '../../store'
import { getUser, useUser } from '../../store/slices/userSlice'
import CustomNavLink from '../CustomNavLink'
import { NavLink } from 'react-router-dom'
import useAvatar from '../hooks/useAvatar'
import { GiShoppingCart } from 'react-icons/gi'


const Header = () => {
  const { products } = useProduct()
  const { isLoggedIn, authUser } = useAuth()
  const {setAvatarEmail, avatar} = useAvatar()
  const { user } = useUser()


  const dispatch = useStoreDispatch()


  useEffect(() => {
    if (authUser && authUser.role === Role.CUSTOMER) {
      
      dispatch(getUser(authUser.id))
    }
  }, [authUser])


  useEffect(() => {
    console.log(user)
    if (user) {
      setAvatarEmail(user.email)
    }

  }, [user])

  const logOutHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(logOut())
    setAvatarEmail('')
  }

  return (
    <header className=' bg-white p-4 overflow-hidden'>
      <div className="container mx-auto  flex justify-between">
        <Logo />
        <div className="flex gap-x-6">
          {/* dynamically add active class */}
          <CustomNavLink isNavLink={true} cssClass='flex items-center hover:font-bold' to="/">Home</CustomNavLink>
          <CustomNavLink isNavLink={true} cssClass='flex items-center hover:font-bold' to="/collections">Collections</CustomNavLink>
          <CustomNavLink isNavLink={true} cssClass='flex items-center hover:font-bold' to="/contact">Contact</CustomNavLink>
        </div>
        <div className="flex gap-x-6 items-center">
          <Search data={products} />

          <CustomNavLink to='/cart' cssClass="text-2xl">
            <GiShoppingCart  />
          </CustomNavLink>
          <div className='relative group'>
            <button className='block rounded-full w-8 h-8 overflow-hidden'>
              {avatar}

            </button>
            <div className="absolute top-7 -left-[10px] bg-white w-[90px] rounded shadow-md z-10 flex flex-col group-hover:visible invisible">
              {
                isLoggedIn && authUser?.role !== Role.ADMIN ?
                  <>
                    <NavLink to={'/account'} className='block min-w-full flex gap-2 text-xs font-normal text-left hover:bg-slate-100 px-2 py-2 items-center justify-between'   >
                      My Account
                    </NavLink>
                    <button onClick={logOutHandler} className='block min-w-full flex gap-2 text-xs font-normal text-left hover:bg-slate-100 px-2 py-2 items-center justify-between'   >
                      Log Out
                    </button>
                  </>
                  :
                  <>
                    <CustomNavLink to='/login' cssClass='block min-w-full flex gap-2 text-xs font-normal text-left hover:bg-slate-100 px-2 py-2 items-center justify-between'   >
                      Log in
                    </CustomNavLink>

                    <CustomNavLink to='/signup' cssClass='block min-w-full flex gap-2 text-xs font-normal text-left hover:bg-slate-100 px-2 py-2 items-center justify-between'   >
                      Sign Up
                    </CustomNavLink>
                  </>
              }

            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header