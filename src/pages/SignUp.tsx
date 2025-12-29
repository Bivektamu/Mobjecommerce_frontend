import { useEffect } from 'react'
import { Action, Toast, Toast_Vairant, Role, Status } from '../store/types'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { useStoreDispatch } from '../store'
import { useAuth, getAuthStatus } from '../store/slices/authSlice'
import BreadCrumbs from '../components/layout/BreadCrumbs'
import { resetUserAction, useUser } from '../store/slices/userSlice'
import { addToast } from '../store/slices/toastSlice';
import PageWrapper from '../components/ui/PageWrapper';
import SignUpForm from '../components/forms/SignUpForm';

const SignUp = () => {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()


  const dispatch = useStoreDispatch()
  const { isLoggedIn, user, status } = useAuth()

  const { user, error: userError, action } = useUser()


  useEffect(() => {
    if (status === Status.IDLE)
      dispatch(getAuthStatus())
  }, [status])

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

      dispatch(resetUserAction())
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

  if (searchParams.get('cart') && isLoggedIn) {
    return <Navigate to="/checkout" />
  }

  if (isLoggedIn && user?.role === Role.CUSTOMER) {
    return <Navigate to="/" />
  }

  return (
    <PageWrapper>
      <section id="breadcrums" className="px-4">
        <div className="md:py-14 py-6 container mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Sign Up</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center py-16 xl:py-32'>
        <div className="w-full md:w-[384px] max-w-full bg-white  px-4 md:px-8 rounded-lg">
          <SignUpForm />
          <p className="text-sm mt-8 text-center text-slate-500">
            Already have an account? <Link to='/login' className='font-semibold text-black'>Log in</Link>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default SignUp