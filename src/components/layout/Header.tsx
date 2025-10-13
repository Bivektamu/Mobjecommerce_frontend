import Logo from '../ui/Logo'
import Search from './Search'

import { useProduct } from '../../store/slices/productSlice'
import { Role } from '../../store/types'
import { logOut, useAuth } from '../../store/slices/authSlice'
import { MouseEvent, useEffect, useState } from 'react'
import { useStoreDispatch } from '../../store'
import { getUser, useUser } from '../../store/slices/userSlice'
import CustomNavLink from '../CustomNavLink'
import { NavLink, useLocation } from 'react-router-dom'
import useAvatar from '../hooks/useAvatar'
import { GiShoppingCart } from 'react-icons/gi'


const Header = () => {
      const { pathname } = useLocation();
  
  const { products } = useProduct()
  const { isLoggedIn, authUser } = useAuth()
  const { setAvatarEmail, avatar } = useAvatar()
  const { user } = useUser()

  const [isOpen, setIsOpen] = useState(false)


  const dispatch = useStoreDispatch()


  useEffect(() => {
    if (authUser && authUser.role === Role.CUSTOMER) {

      dispatch(getUser(authUser.id))
    }
  }, [authUser])

  useEffect(()=> {
    setIsOpen(false)
  }, [pathname])


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
    <header className='bg-white p-4 fixed lg:static w-full h-[75px] z-30'>
      <nav className="container mx-auto  flex justify-between flex-wrap items-center">
        <Logo />
        <div className={`flex h-[100%] text-3xl lg:text-base items-center justify-center pb-[75px]  gap-6 fixed lg:static flex-col lg:flex-row w-full lg:w-fit bg-white  left-0 p-4 lg:p-0 z-20 transition-all duration-700 ease-in-out top-[75px] origin-top lg:translate-x-0 ${isOpen?'translate-x-0':'-translate-x-[100%]'}`}>
          {/* dynamically add active class */}
          <CustomNavLink isNavLink={true} cssClass='flex items-center hover:font-bold' to="/">Home</CustomNavLink>
          <CustomNavLink isNavLink={true} cssClass='flex items-center hover:font-bold' to="/collections">Collections</CustomNavLink>
          <CustomNavLink isNavLink={true} cssClass='flex items-center hover:font-bold' to="/contact">Contact</CustomNavLink>

        </div>


        <div className="flex gap-x-2 md:gap-x-6 items-center">

          <div className="hidden md:block">
            <Search data={products} />
          </div>

          <CustomNavLink to='/cart' cssClass="text-2xl">
            <GiShoppingCart />
          </CustomNavLink>


          <div className='relative group'>
            <button className='block rounded-full w-8 h-8 overflow-hidden'>
              {avatar}
            </button>
            <div className="absolute top-7 right-0 bg-white w-[70px] rounded shadow-md z-30 flex flex-col group-hover:visible invisible ">
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
                    <CustomNavLink to='/login' cssClass='block min-w-full flex gap-2 text-xs font-normal text-left hover:bg-slate-100 slate-100 px-2 py-2 items-center justify-between'   >
                      Log in
                    </CustomNavLink>

                    <CustomNavLink to='/signup' cssClass='block min-w-full flex gap-2 text-xs font-normal text-left hover:bg-slate-100 slate-100 px-2 py-2 items-center justify-between'   >
                      Sign Up
                    </CustomNavLink>
                  </>
              }

            </div>
          </div>

            <button type="button" id='burger-menu' className={`lg:hidden ${isOpen?'active':''}`} onClick={()=>setIsOpen(!isOpen)}>
            <span></span>
          </button>

        </div>
      </nav>
    </header>
  )
}

export default Header