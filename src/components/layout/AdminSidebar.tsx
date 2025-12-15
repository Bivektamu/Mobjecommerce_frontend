import { NavLink } from 'react-router-dom'
import AdminLogo from '../ui/AdminLogo'
import { MdOutlineDashboard } from 'react-icons/md'
import { AiOutlineProduct } from 'react-icons/ai'
import { BsCart4 } from 'react-icons/bs'
import { IoPeople } from 'react-icons/io5'
import StarIcon from '../ui/StarIcon'
import { useStoreDispatch } from '../../store'
import { MouseEvent } from 'react'
import { logOut } from '../../store/slices/authSlice'
type Props = {
  isOpen: boolean
}
const AdminSidebar = ({isOpen}:Props) => {
  const dispatch = useStoreDispatch()

  const logOutHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    dispatch(logOut())
  }
  return (
    <section className={`w-[180px] lg:w-[220px] z-20  bg-white h-dvh lg:px-6 px-4 fixed left-0 top-0 pt-8  md:-translate-x-0 transition-all duration-700 ease-in-out ${!isOpen?'-translate-x-[180px]':'translate-x-0 '}`}>
      <div className="h-[72px] w-full flex items-center justify-center mb-12">
        <AdminLogo />
      </div>
      <nav className='flex flex-col gap-4'>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 hover:font-semibold items-center`} to="/admin/dashboard">
          <MdOutlineDashboard />
          <span className="text-xs md:text-sm">Dashboard</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 hover:font-semibold items-center`} to="/admin/products">
          <AiOutlineProduct />
          <span className="text-xs md:text-sm">Products</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 hover:font-semibold items-center`} to="/admin/orders">
          <BsCart4 />
          <span className="text-xs md:text-sm">Orders</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 hover:font-semibold items-center`} to="/admin/customers">
          <IoPeople />
          <span className="text-xs md:text-sm">Customers</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 items-center hover:font-semibold`} to="/admin/reviews">
          <StarIcon />
          <span className="text-xs md:text-sm">Reviews</span>
        </NavLink>
        <button onClick={logOutHandler} className='p-2 lg:pl-6 hover:font-semibold rounded flex lg:gap-x-4 gap-x-2 items-center'>
          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8571 12.5V14.7857C11.8571 15.0888 11.7367 15.3795 11.5224 15.5938C11.3081 15.8081 11.0174 15.9286 10.7143 15.9286H2.71427C2.41116 15.9286 2.12047 15.8081 1.90615 15.5938C1.69182 15.3795 1.57141 15.0888 1.57141 14.7857V2.21427C1.57141 1.91116 1.69182 1.62047 1.90615 1.40615C2.12047 1.19182 2.41116 1.07141 2.71427 1.07141H10.7143C11.0174 1.07141 11.3081 1.19182 11.5224 1.40615C11.7367 1.62047 11.8571 1.91116 11.8571 2.21427V4.49998M8.42855 8.49998H16.4286M16.4286 8.49998L14.1428 6.21427M16.4286 8.49998L14.1428 10.7857" stroke="#5C5F6A" strokeWidth="1.43" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs md:text-sm">Log Out</span>


        </button>
      </nav>
    </section>
  )
}

export default AdminSidebar