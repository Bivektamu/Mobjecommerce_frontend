import { FormEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { Cart, LoginInput, FormError, Role, Toast, Toast_Vairant, ValidateSchema } from '../store/types'
import { useStoreDispatch } from '../store/index'
import { useAuth, logInUser, getAuthStatus } from '../store/slices/authSlice'

import BreadCrumbs from '../components/layout/BreadCrumbs'
import validateForm from '../utils/validate'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CustomNavLink from '../components/CustomNavLink'
import { upDateCart, useCart } from '../store/slices/cartSlice'
import PageWrapper from '../components/ui/PageWrapper'
import { addToast } from '../store/slices/toastSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LogIn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const dispatch = useStoreDispatch()
  const { isLoggedIn, authUser } = useAuth()
  const { cart } = useCart()


  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormError>({} as FormError)
  const [showPass, setShowPass] = useState(false)


  // code to remove error info when fields are typed
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.keys(formData).map(key => {
        if (formData[key as keyof typeof formData]) {
          setErrors(prev => ({ ...prev, [key]: '' }))
        }

      })
    }
  }, [formData])


  useEffect(() => {
    dispatch(getAuthStatus())
  }, [])

  useEffect(() => {
    // console.log(isLoggedIn, authUser)
    if (isLoggedIn && authUser?.role === Role.CUSTOMER)
      navigate('/')
  }, [isLoggedIn, authUser])

  useEffect(() => {
    if (searchParams.get('cart')) {

      const cartItems = cart.map((item: Cart) => ({ ...item, customerId: item.userId || authUser?.id }))
      dispatch(upDateCart(cartItems))
      navigate('/checkout')
    }
  }, [searchParams])


  const { email, password } = formData


  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }



  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()


    const validateSchema: ValidateSchema<unknown>[] =
      [
        {
          name: 'email',
          type: 'email',
          value: email
        },
        {
          name: 'password',
          type: 'string',
          value: password
        }
      ]


    const newErrors: typeof errors = validateForm(validateSchema)


    if (Object.keys(newErrors).length > 0) {
      return setErrors({ ...newErrors })
    }

    const toast: Toast = {
      id: uuidv4(),
      variant: Toast_Vairant.SUCCESS,
      msg: 'Sign In successful'
    }

    dispatch(logInUser(formData))
      .unwrap()
      .then(() => {
        dispatch(addToast(toast))

      })
      .catch((error) => {
        toast.variant = Toast_Vairant.WARNING
        toast.msg = error.message.replaceAll('_', ' ')
        dispatch(addToast(toast))
      })
  }



  return (
    <PageWrapper>
      <section id="breadcrums" className="px-4">
        <div className="md:py-14 py-6 container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center'>
        <div className="md:w-[384px] w-full  max-w-full bg-white pt-8 pb-12 md:px-8 px-4 rounded-lg">


          <form onSubmit={handleSubmit}>
            <fieldset className='mb-6'>
              <label htmlFor="email" className='font-medium block mb-1 text-mblack'>Email</label>
              <input type="text" id="email" name='email' value={email} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block w-full py-2 px-4 ' />
              {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
            </fieldset>

            <fieldset className='mb-6 relative'>
              <label htmlFor="password" className='font-medium block w-full mb-1'>Password</label>
              <input
                type={`${showPass ? 'text' : 'password'}`}
                id="password"
                name='password'
                value={password} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block w-full py-2 px-4' />
              <button type='button' className='absolute right-0 -translate-y-7 right-3 opacity-50' onClick={() => setShowPass(!showPass)}>
                {!showPass ? <FaEye /> : <FaEyeSlash />}
              </button>
              {errors.password && <span className='text-sm text-red-500'>{errors.password}</span>}
            </fieldset>
            <button type="submit" className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer w-full'>Login</button>
          </form>
          <p className="text-sm mt-8 text-center text-slate-500">
            Don't have an account? <CustomNavLink to='/signup' cssClass='font-semibold'>Sign up</CustomNavLink>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default LogIn