import { FormEvent, useEffect, useState } from 'react'
import { Action, CreateUserForm, FormError, Toast, Toast_Vairant, Role } from '../store/types'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { useStoreDispatch } from '../store'
import { useAuth, getAuthStatus } from '../store/slices/authSlice'
import BreadCrumbs from '../components/layout/BreadCrumbs'
import { ValidateSchema } from '../store/types'
import validateForm from '../utils/validate'
import { createUser, useUser } from '../store/slices/userSlice'
import { addToast } from '../store/slices/toastSlice';
import PageWrapper from '../components/ui/PageWrapper';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()


  const dispatch = useStoreDispatch()
  const { isLoggedIn, authUser } = useAuth()

  const { user, error: userError, action } = useUser()


  useEffect(() => {
    dispatch(getAuthStatus())
  }, [])

  useEffect(() => {
    if (user && action === Action.ADD) {
      // console.log(user);

      const newToast: Toast = {
        id: uuidv4(),
        variant: Toast_Vairant.SUCCESS,
        msg: 'Your account has been created succesfully. Please login now.'
      }

      if (searchParams.get('cart')) newToast.msg = 'Your accound has been created.'

      dispatch(addToast(newToast))

      if (searchParams.get('cart')) return navigate('/checkout')
      return navigate('/login')

    }
  }, [user])

  useEffect(() => {
    if (userError) {
      const newToast: Toast = {
        id: uuidv4(),
        variant: Toast_Vairant.DANGER,
        msg: userError
      }
      dispatch(addToast(newToast))
    }
  }, [userError])

  const [userForm, setUserForm] = useState<CreateUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormError>({})
  const [showPass, setShowPass] = useState(false)


  // code to remove error info when fields are typed
  useEffect(() => {
    if (Object.keys(userForm).length > 0) {
      Object.keys(userForm).map(key => {
        if (userForm[key as keyof typeof userForm]) {
          setErrors(prev => ({ ...prev, [key]: '' }))
        }

      })
    }
  }, [userForm])


  const { firstName, lastName, email, password } = userForm


  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()


    const validateSchema: ValidateSchema<unknown>[] =
      [
        {
          name: 'firstName',
          type: 'text',
          value: firstName,
          msg: 'Please insert first name.'
        },
        {
          name: 'lastName',
          type: 'text',
          value: lastName,
          msg: 'Please insert last name.'
        },
        {
          name: 'email',
          type: 'email',
          value: email
        },
        {
          name: 'password',
          type: 'password',
          value: password
        }
      ]


    const newErrors: FormError = validateForm(validateSchema)

    if (Object.keys(newErrors).length > 0) {
      return setErrors({ ...newErrors })
    }

    dispatch(createUser(userForm))

  }

  if (searchParams.get('cart') && isLoggedIn) {
    return <Navigate to="/checkout" />
  }

  if (isLoggedIn && authUser?.role === Role.CUSTOMER) {
    return <Navigate to="/" />
  }

  return (
    <PageWrapper>
      <section id="breadcrums" className="">
        <div className="py-14 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center py-32'>
        <div className="w-[384px] max-w-full bg-white  px-8 rounded-lg">

          <form onSubmit={handleSubmit}>
            <fieldset className='mb-6'>
              <label htmlFor="firstName" className='font-medium block mb-1 text-slate-600 text-sm'>First name</label>
              <input type="text" id="firstName" name='firstName' value={firstName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4 ' />
              {errors.firstName && <span className='text-xs text-red-500'>{errors.firstName}</span>}
            </fieldset>

            <fieldset className='mb-6'>
              <label htmlFor="lastName" className='font-medium block mb-1 text-slate-600 text-sm'>Last name</label>
              <input type="text" name='lastName' id="lastName" value={lastName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4 ' />
              {errors.lastName && <span className='text-xs text-red-500'>{errors.lastName}</span>}
            </fieldset>

            <fieldset className='mb-6'>
              <label htmlFor="email" className='font-medium block mb-1 text-slate-600 text-sm'>Email</label>
              <input type="text" id="email" name='email' value={email} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4 ' />
              {errors.email && <span className='text-xs text-red-500'>{errors.email}</span>}
            </fieldset>

            <fieldset className='mb-6 relative'>
              <label htmlFor="password" className='font-medium block w-full mb-1 text-sm text-slate-600'>Password</label>
              <input
                type={`${showPass ? 'text' : 'password'}`}
                id="password"
                name='password'
                value={password}
                onChange={changeHandler}
                className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4' />
              <button type='button' className='absolute right-0 -translate-y-7 right-3 opacity-50' onClick={() => setShowPass(!showPass)}>
                {!showPass ? <FaEye /> : <FaEyeSlash />}
              </button>

              {errors.password && <span className='text-xs text-red-500'>{errors.password}</span>}
            </fieldset>

            <p className="text-xs mb-8 font-medium text-slate-500">
              By creating an account you agree with our Terms of Service, Privacy Policy,
            </p>
            <button type="submit" className='bg-black text-white py-2 px-4 rounded text-center text-sm cursor-pointer w-full'>Create Account</button>
          </form>
          <p className="text-sm mt-8 text-center text-slate-500">
            Already have an account? <Link to='/login' className='font-semibold'>Log in</Link>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default SignUp