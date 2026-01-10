import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'


import { Action, Cart, Colour, FormError, Product, Role, Size, Toast, Toast_Vairant, ValidateSchema } from '../../store/types'
import CircleLoader from '../ui/CircleLoader'
import getClasses from '../../utils/getClasses'
import validateForm from '../../utils/validate'
import SquareLoader from '../ui/SquareLoader'
import { useAuth } from '../../store/slices/authSlice'
import { addToCart, resetCartAction, updateCartQuantity, useCart } from '../../store/slices/cartSlice';
import { useStoreDispatch } from '../../store';
import { addToast } from '../../store/slices/toastSlice';
import LikeButton from '../wishList/LikeButton';

type Props = {
    product: Product | null
}

const ALL_SIZES = [Size.SMALL, Size.MEDIUM, Size.LARGE, Size.EXTRA_LARGE]

function AddToCartForm({ product }: Props) {
    const dispatch = useStoreDispatch()
    const { user } = useAuth()
    const { action, cart } = useCart()

    const [formData, setFormData] = useState<Cart>({
        id: '',
        userId: null,
        productId: product?.id || '',
        color: null,
        size: null,
        quantity: 0,
        price: product?.price || null,
        imgUrl: ''
    })

    const [userCart, setUserCart] = useState<Cart[]>([])
    const [itemExists, setItemExists] = useState<boolean>(false)

    const [formErrors, setFormErrors] = useState<FormError>({})

    useEffect(() => {
        if (product && Object.keys(product).length > 0) {
            setFormData({ ...formData, id: product?.id, productId: product?.id, price: product?.price, imgUrl: product?.imgs[0].url })
        }
    }, [product])

    // code to set userId in cart items
    useEffect(() => {
        if (user && user.role === Role.CUSTOMER) {
            setFormData({ ...formData, userId: user.id })
        }
    }, [user])

    //code to filter cart items specific to current user
    useEffect(() => {
        if (cart.length > 0) {
            if (user) {
                setUserCart(cart.filter(cartItem => cartItem.userId === user.id && cartItem.productId === formData.productId))
            }
            else {
                setUserCart(cart.filter(CartItem => !CartItem.userId && CartItem.productId === formData.productId))
            }

        }
    }, [user, cart, formData.productId])

    // code to remove error info when fields are typed
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            Object.keys(formData).map(key => {
                if (formData[key as keyof Cart]) {
                    setFormErrors(prev => ({ ...prev, [key]: '' }))
                }
            })
        }
    }, [formData])

    useEffect(() => {
        if (action) {
            let msg = '';
            switch (action) {
                case Action.ADD:
                    msg = 'Product added to cart'
                    break;

                case Action.EDIT:
                    msg = 'Item updated on cart'
                    break;

                default:
                    break;
            }
            const toast: Toast = {
                id: uuidv4(),
                variant: Toast_Vairant.SUCCESS,
                msg: msg
            }
            dispatch(addToast(toast))
        }
    }, [action])

    const { color, size, quantity, productId } = formData

    useEffect(() => {

        if (color && size) {
            setFormData(prev => ({ ...prev, id: product?.id + '_' + color + '_' + size }))
        }

        if (userCart.length > 0 && color && size) {

            const itemExistsOrNot = (userCart.filter(item => item.color === color && item.size === size))
            if (itemExistsOrNot.length > 0) {
                setItemExists(true)
            }
            else {
                setItemExists(false)
            }
        }
    }, [color, size, userCart])


    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.stopPropagation()
        const { name, value } = e.target
        if (!product) return
        if (action === Action.ADD) dispatch(resetCartAction())

        if (name === 'quantity') {
            if (parseInt(value) > product?.quantity) {
                return
            }
            else
                setFormData({ ...formData, quantity: parseInt(value) })
        }
        else {
            setFormData({ ...formData, [name]: value })
        }


    }


    const rangeHandler = (e: MouseEvent<HTMLButtonElement>, type: string) => {
        e.stopPropagation()
        if (!product) return
        if (action === Action.ADD) dispatch(resetCartAction())
        if (type === '-') {
            if (formData.quantity > 0) {
                setFormData({ ...formData, quantity: formData.quantity - 1 })
            }
        }
        else {
            if (formData.quantity < product?.quantity) {
                setFormData({ ...formData, quantity: formData.quantity + 1 })
            }
        }
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        const validateSchema: ValidateSchema<unknown>[] =
            [
                {
                    name: 'color',
                    type: 'text',
                    value: color,
                    msg: 'Please select color'
                },
                {
                    name: 'size',
                    type: 'text',
                    value: size,
                    msg: 'Please select size'
                },

                {
                    name: 'quantity',
                    type: 'number',
                    value: quantity,
                    msg: 'Please select quantity'
                },
            ]

        const errors = validateForm(validateSchema)

        if (Object.keys(errors).length > 0) {
            return setFormErrors(prev => ({ ...prev, ...errors }))
        }

        if (userCart.length > 0) {
            const itemExistsOrNot = (userCart.filter(item => item.color === color && item.size === size))

            if (itemExistsOrNot.length > 0) {
                const productToAdd = { ...formData, id: itemExistsOrNot[0].id }
                dispatch(updateCartQuantity(productToAdd))
            }
            else {
                const productToAdd = { ...formData, id: (user?.id || '') + productId + color + size }
                dispatch(addToCart(productToAdd))
            }
        }
        else {
            const productToAdd = { ...formData, id: (user?.id || '') + productId + color + size }
            dispatch(addToCart({ ...productToAdd }))
        }

        setFormData(prev => ({
            ...prev,
            color: null,
            size: null,
            quantity: 0,
        }))
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="mb-8">
                <p className="text-sm mb-3 font-medium text-slate-500 uppercase text-wider">Availabe Colours</p>
                {(!product) ? <CircleLoader /> :
                    <div className="flex gap-4 items-center">

                        {
                            product?.colors.map((item: Colour, i) => {

                                const { bgClass, borderClass } = getClasses(item)

                                return (
                                    <fieldset key={i}>
                                        <label htmlFor={item} className={`w-8 h-8 block rounded-full ${bgClass}  cursor-pointer relative after:content-[""] after:w-10 after:h-10 after:rounded-full  after:absolute after:top-0 after:bottom-0 after:-right-1  after:m-auto ${color === item ? `after:${borderClass} after:border-2` : ''} }`}></label>
                                        <input type="radio" id={item} name="color" value={item} onChange={changeHandler} className='appearance-none hidden ' />
                                    </fieldset>
                                )
                            })
                        }
                    </div>
                }
                {formErrors.color && <span className='text-red-500 text-xs'>{formErrors.color}</span>}

            </div>

            <fieldset className='mb-8'>
                <legend className='font-medium text-slate-600 text-sm block mb-2 w-full uppercase'>Select Size</legend>
                {
                    (!product) ? <SquareLoader square={4} /> :
                        <>
                            <div className="flex gap-4">

                                {
                                    ALL_SIZES.map((item, i) =>
                                        <fieldset key={i}>
                                            <input type="radio" onChange={changeHandler} name="size" id={item} value={item} className='appearance-none hidden' />
                                            <label htmlFor={item} className={`w-8 block flex items-center justify-center h-8 text-sm font-medium rounded cursor-pointer border-[1px] ${product?.sizes.indexOf(item) < 0 ? 'bg-cultured pointer-events-none text-slate-400' : size === item ? 'bg-slate-200' : ''}`}>{item}</label>
                                        </fieldset>

                                    )
                                }

                            </div>
                            {formErrors.size && <span className='text-red-500 text-xs'>{formErrors.size}</span>
                            }
                        </>
                }

            </fieldset>

            <fieldset className='mb-8'>
                <label htmlFor="quantity" className='font-medium text-slate-600 text-sm block mb-2 w-full uppercase'>Quantity</label>
                <div className="flex items-center gap-4 w-min  justtify-start border-cultured border-[2px] rounded px-4 py-2">
                    <button type="button" className='w-6 h-6 relative' onClick={e => rangeHandler(e, '-')}>
                        <span className='w-4 h-[2px] bg-slate-600 absolute top-0 bottom-0 m-auto left-0 right-0'></span>
                    </button>

                    <input type="number" name='quantity' value={quantity} onChange={changeHandler} className='w-[50px] text-center outline-none ' />

                    <button type="button" className='w-6 h-6 relative' onClick={e => rangeHandler(e, '+')}>
                        <span className='w-4 h-[2px] bg-slate-600 absolute top-0 bottom-0 m-auto left-0 right-0'></span>
                        <span className='h-4 w-[2px] bg-slate-600 absolute top-0 bottom-0 m-auto left-0 right-0'></span>
                    </button>

                </div>
                {formErrors.quantity && <span className='text-red-500 text-xs'>{formErrors.quantity}</span>}

                {
                    itemExists &&
                    <span className='text-xs italic text-slate-400 block pt-4'>You have this item with exact specification in cart.<br /> View in cart or  update quantity.</span>
                }
            </fieldset>

            {action === Action.ADD || action === Action.EDIT ? (<Link to='/cart' className={`w-[200px]  py-2 px-4 rounded text-center cursor-pointer text-sm bg-black text-white`} >See In Cart</Link>) : (<button type="submit" className={`w-[200px]  py-2 px-4 rounded text-center cursor-pointer text-sm ${product?.stockStatus ? 'bg-black text-white' : 'pointer-events-none bg-cultured text-slate-500'}`} >
                {
                    itemExists ? 'Update ' : 'Add to '
                }
                Cart
            </button>)}

            {
                product && <LikeButton productId={product.id} />
            }


        </form>
    )
}

export default AddToCartForm