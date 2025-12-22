import { FormEvent, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FormError, LoginInput, Toast, Toast_Vairant, ValidateSchema } from '../../store/types';
import validateForm from '../../utils/validate';
import { v4 } from 'uuid';
import { useStoreDispatch } from '../../store';
import { logInUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/toastSlice';

const LoginForm = () => {

    const dispatch = useStoreDispatch()

    const [showPass, setShowPass] = useState(false)

    const [formData, setFormData] = useState<LoginInput>({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<FormError>({} as FormError)


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
            id: v4(),
            variant: Toast_Vairant.SUCCESS,
            msg: 'Sign In successful'
        }

        dispatch(logInUser(formData))
            .unwrap()
            .then(() => {
                console.log('success')
                dispatch(addToast(toast))

            })
            .catch((error) => {
                console.log(error)
                toast.variant = Toast_Vairant.WARNING
                toast.msg = error
                dispatch(addToast(toast))
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset className='mb-6'>
                <label htmlFor="email" className='font-medium block w-full mb-1 text-sm md:text-base'>Email</label>
                <input type="text" id="email" name='email' value={email} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block w-full py-2 px-4 text-sm md:text-base ' />
                {errors.email && <span className='text-xs md:text-sm text-red-500'>{errors.email}</span>}
            </fieldset>

            <fieldset className='mb-6 relative'>
                <label htmlFor="password" className='font-medium block w-full mb-1 text-sm md:text-base'>Password</label>
                <input
                    type={`${showPass ? 'text' : 'password'}`}
                    id="password"
                    name='password'
                    value={password} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block w-full py-2 px-4 text-sm md:text-base' />
                <button type='button' className='absolute right-0 -translate-y-7 right-3 opacity-50' onClick={() => setShowPass(!showPass)}>
                    {!showPass ? <FaEye /> : <FaEyeSlash />}
                </button>
                {errors.password && <span className='text-xs md:text-sm text-red-500'>{errors.password}</span>}
            </fieldset>
            <button type="submit" className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer w-full text-sm md:text-base'>Login</button>
        </form>
    )
}

export default LoginForm