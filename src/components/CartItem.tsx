import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from 'react'
import { Cart, Colour, Product, Toast, Toast_Vairant } from '../store/types'
import { useProduct } from '../store/slices/productSlice'
import { useStoreDispatch } from '../store'
import SquareLoader from './ui/SquareLoader'
import TextLoader from './ui/TextLoader'
import Close from './ui/Close'
import getClasses from '../utils/getClasses'
import { deleteCart, updateCartQuantity } from '../store/slices/cartSlice'
import Modal from './layout/Modal'
import { v4 } from 'uuid'
import { addToast } from '../store/slices/toastSlice'

type Props = {
    cartItem: Cart,
}

const CartItem = ({ cartItem }: Props) => {

    const dispatch = useStoreDispatch()
    const { products } = useProduct()

    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState<number>(cartItem.quantity)
    const [showModal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState<ReactElement | null>(null)


    useEffect(() => {
        if (products.length > 0) {
            const productExist: Product | undefined = products.find((p: Product) => p.id === cartItem.productId)
            setProduct(productExist || null)
        }
    }, [products, cartItem])

    useEffect(() => {
        dispatch(updateCartQuantity({
            id: cartItem.id,
            quantity: quantity || 0
        }))

    }, [quantity, dispatch, cartItem])

    useEffect(() => {
        if (modalContent) {
            setShowModal(true)
        }
    }, [modalContent])



    const rangeHandler = (e: MouseEvent<HTMLButtonElement>, type: string) => {
        e.stopPropagation()
        e.preventDefault()
        if (!product) return

        if (type === '-') {
            if (quantity > 1) {
                setQuantity(quantity - 1)
            }
        }
        else {
            if (quantity < product?.quantity) {
                setQuantity(quantity + 1)
            }
        }
    }


    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!product) return


        if (parseInt(e.target.value) > product?.quantity) {
            return
        }
        setQuantity(parseInt(e.target.value || '1'))
    }

    const deleteHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const content = (
            <div className='text-center'>
                <p className="mb-6 font-medium md:text-sm text-xs">Are you sure you want to delete this product?</p>
                <div className="flex gap-x-4 justify-center">
                    <button className='border-slate-600 border px-4 py-2 rounded' onClick={e => closeModal(e)}>Cancel</button>
                    <button className='bg-black text-white  px-4 py-2 rounded' onClick={() => deleteCartItem(cartItem.id)}>Delete</button>
                </div>
            </div>
        )
        setModalContent(content)

        // dispatch(deleteCart(cartItem.id))
    }


    const deleteCartItem = (id: string) => {
        setShowModal(false)
        setModalContent(null)
        dispatch(deleteCart(id))
        const toast: Toast = {
            id: v4(),
            variant: Toast_Vairant.SUCCESS,
            msg: `Item removed from your cart`
        }
        dispatch(addToast(toast))
    }

    const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setShowModal(false)
        setModalContent(null)
    }

    return (
        <div key={cartItem.id} className="flex items-center justify-between gap-x-12 md:gap-y-8 gap-y-4 mb-8 md:flex-row flex-col">
            <div className="flex items-center gap-6 w-full md:w-auto text-sm md:text-base">
                {!product ? <SquareLoader square={1} squareClass='min-w-16 min-h-16' />
                    :
                    <div className='bg-cultured'>
                        <img src={product.imgs[0]?.url} alt={product.title} className="w-16 h-16 object-contain" />
                    </div>
                }
                <div>
                    <h3 className="font-semibold mb-2 ">{product ? product.title : <TextLoader col='1' cssClass='w-[80px] h-4' />}</h3>
                    {!product ? <TextLoader col='1' cssClass='w-[80px] h-4' />
                        :
                        <p className='flex items-center text-xs gap-2'>Color: <span className={`w-4 h-4 rounded-full ${getClasses(cartItem.color as Colour).bgClass}`}></span> {cartItem.color} <span className="w-4 h-[2px] bg-slate-500"></span> Size: {cartItem.size}</p>
                    }
                </div>
            </div>

            <div className='flex items-center gap-4 w-full md:w-auto text-sm md:text-base'>

                {!product ? <TextLoader col='1' cssClass='w-8 h-8' /> : <p className='font-semibold mr-4'>$ {cartItem.price}</p>}


                {
                    !product ? <TextLoader col='1' cssClass='w-24 h-8' /> :

                        <fieldset className=''>
                            <div className="flex items-center gap-2 w-min  justtify-start border-cultured border-[2px] rounded px-2 py-2">
                                <button type="button" className='w-4 h-4 relative' onClick={e => rangeHandler(e, '-')}>
                                    <span className='w-3 h-[2px] bg-slate-600 absolute top-0 bottom-0 m-auto left-0 right-0'></span>
                                </button>

                                <input type="number" name='quantity' value={quantity} onChange={changeHandler} className='w-[30px] text-center outline-none ' />

                                <button type="button" className='w-4 h-4 relative' onClick={e => rangeHandler(e, '+')}>
                                    <span className='w-3 h-[2px] bg-slate-600 absolute top-0 bottom-0 m-auto left-0 right-0'></span>
                                    <span className='h-3 w-[2px] bg-slate-600 absolute top-0 bottom-0 m-auto left-0 right-0'></span>
                                </button>
                            </div>
                        </fieldset>
                }
                <button className='w-10 h-10 bg-cultured flex justify-center items-center' onClick={deleteHandler}>
                    <Close classN='bg-black w-4 relative' />
                </button>

            </div>

            {
                <Modal isOpen={showModal} close={() => setShowModal(false)} >
                    {modalContent!}
                </Modal>
            }

        </div >
    )
}

export default CartItem