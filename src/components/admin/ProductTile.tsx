import { MouseEvent, useState } from 'react'
import { Product } from '../../store/types'
import { Link } from 'react-router-dom'
import Check from '../../components/ui/Check'
import Close from '../ui/Close'
import Modal from '../layout/Modal'
import { deleteProduct } from '../../store/slices/productSlice'
import { useStoreDispatch } from '../../store'

type Props = {
    product: Product
}

const ProductTile = ({ product }: Props) => {
    const dispatch = useStoreDispatch()

    const [isOption, setIsOption] = useState(false)
    const [showModal, setShowModal] = useState(false)



    const deleteProductFunc = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // setShowModal(false)
        dispatch(deleteProduct(product.id))
    }

    return (
        <div key={product.id} className='grid grid-cols-1 xl:grid-cols-table px-8 py-4 lg:border-b-[1px] items-center justify-center gap-x-4 gap-y-2 bg-white shadow lg:shadow-none rounded xl:rounded-none'>
            <Link to={`/admin/products/${product.slug}`} className='justify-center flex'>
                <img src={product.imgs[0].url} alt="" className='md:w-1/2 lg:w-auto' />
            </Link>

            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500 text-sm block xl:hidden">Name</span>
                <Link to={`/admin/products/${product.slug}`} className='break-normal text-xs md:text-sm   text-slate-500 col-span-2 xl:col-span-3'>{product.title}</Link>
            </div>

            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500 text-sm block xl:hidden">SKU</span>

                <span className='text-xs md:text-sm   text-slate-500 uppercase col-span-2 xl:col-span-3'>
                    {product.sku}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500 text-sm block xl:hidden">Price</span>
                <span className='text-xs md:text-sm   text-slate-500 col-span-2 xl:col-span-3'>
                    {product.price}
                </span>
            </div>
            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500 text-sm block xl:hidden">Category</span>
                <span className='text-xs md:text-sm   text-slate-500 capitalize col-span-2 xl:col-span-3'>
                    {product.category}
                </span>
            </div>
            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500 text-sm block xl:hidden">In Stock</span>

                <div className='col-span-2 xl:col-span-3'>

                    {product.stockStatus ? <Check classN='border-slate-600' /> : <Close classN='w-4 bg-slate-600' />}
                </div>
            </div>


            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500 text-sm block xl:hidden">Featured</span>
                <div className='col-span-2 xl:col-span-3 text-left'>

                    {product.featured ? <Check classN='border-slate-600' /> : <Close classN='w-4 bg-slate-600' />}
                </div>
            </div>

            <div className="grid gap-4  grid-cols-3 mt-4 xl:hidden">
                <Link className='text-xs md:text-sm border-[1px] py-2 px-4 md:p-2  border-slate-700 font-medium  text-center rounded' to={`/admin/products/${product.slug}`}>Edit</Link>

                <button
                    className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-xs block'
                    onClick={() => setShowModal(true)}
                >Delete</button>
            </div>



            <div className='flex text-lg text-slate-500 font-semibold relative  items-center justify-start pb-2'>
                <button className='hidden xl:block' onClick={() => setIsOption(true)} >...</button>
                {
                    isOption &&

                    <div className='absolute bg-white border-[1px] rounded-lg shadow w-[100px]  -translate-x-[55px] translate-y-[45px] after:content-[""] after:absolute after:w-[100%] after:h-[10px] after:-top-[10px]' onMouseLeave={() => setIsOption(false)}>
                        <Link className='block w-full text-xs md:text-sm   font-normal text-left hover:bg-slate-100 px-4 py-2' to={`/admin/products/${product.slug}`}>Edit</Link>

                        <button
                            className='block w-full text-xs md:text-sm   font-normal text-left hover:bg-slate-100 px-4 py-2 pb-4'
                            onClick={() => setShowModal(true)}
                        >Delete</button>
                    </div>
                }
            </div>

            {/* Dialog box to delete product */}
            <Modal isOpen={showModal} close={() => setShowModal(false)} >
                <div className='text-center'>
                    <p className="mb-6 font-medium text-xs md:text-sm">Are you sure you want to delete this product?</p>
                    <div className="flex gap-x-4 justify-center">
                        <button
                            className='border-slate-600 border px-4 py-2 rounded text-xs md:text-base'
                            onClick={() => setShowModal(false)}

                        >Cancel</button>
                        <button className='bg-black text-white px-4 py-2 rounded text-xs md:text-base'
                            onClick={deleteProductFunc}>
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}

export default ProductTile