import { NavLink } from 'react-router-dom'
import AdminLogo from '../ui/AdminLogo'
import { MdOutlineDashboard } from 'react-icons/md'
import { AiOutlineProduct } from 'react-icons/ai'
import { BsCart4 } from 'react-icons/bs'
import { IoPeople } from 'react-icons/io5'
import StarIcon from '../ui/StarIcon'

const AdminSidebar = () => {
  return (
    <section className='lg:w-[280px] w-[180px] bg-white h-screen lg:px-6 px-4 fixed left-0 top-0 pt-8'>
      <div className="h-[72px] w-full flex items-center justify-center mb-12">
        <AdminLogo />
      </div>
      <nav className='flex flex-col gap-4'>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 items-center`} to="/admin/dashboard">
          <MdOutlineDashboard />
          <span className="text-sm">Dashboard</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 items-center`} to="/admin/products">
          <AiOutlineProduct />
          <span className="text-sm">Products</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 items-center`} to="/admin/orders">
          <BsCart4 />
          <span className="text-sm">Orders</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 items-center`} to="/admin/customers">
          <IoPeople />
          <span className="text-sm">Customers</span>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'font-semibold bg-regal-white' : '') + ` p-2 lg:pl-6 rounded flex lg:gap-x-4 gap-x-2 items-center`} to="/admin/reviews">
          <StarIcon />
          <span className="text-sm">Reviews</span>
        </NavLink>
      </nav>
    </section>
  )
}

export default AdminSidebar