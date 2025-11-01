import React, { FormEvent, useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useStoreDispatch } from '../../store';
import { CreateUserForm, FormError, ValidateSchema } from '../../store/types';
import validateForm from '../../utils/validate';
import { createUser } from '../../store/slices/userSlice';

const SignUpForm = () => {
      const dispatch = useStoreDispatch()

      

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
    
    return (
        <form onSubmit={handleSubmit}>
            <fieldset className='mb-6'>
                <label htmlFor="firstName" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>First name</label>
                <input type="text" id="firstName" name='firstName' value={firstName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs md:text-sm text-black w-full py-2 px-4 ' />
                {errors.firstName && <span className='text-xs text-red-500'>{errors.firstName}</span>}
            </fieldset>

            <fieldset className='mb-6'>
                <label htmlFor="lastName" className='font-medium block mb-1 text-slate-600 text-xs  md:text-sm'>Last name</label>
                <input type="text" name='lastName' id="lastName" value={lastName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs    md:text-sm text-black w-full py-2 px-4 ' />
                {errors.lastName && <span className='text-xs text-red-500'>{errors.lastName}</span>}
            </fieldset>

            <fieldset className='mb-6'>
                <label htmlFor="email" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>Email</label>
                <input type="text" id="email" name='email' value={email} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs md:text-sm text-black w-full py-2 px-4 ' />
                {errors.email && <span className='text-xs text-red-500'>{errors.email}</span>}
            </fieldset>

            <fieldset className='mb-6 relative'>
                <label htmlFor="password" className='font-medium block w-full mb-1 text-xs  md:text-sm text-slate-600'>Password</label>
                <input
                    type={`${showPass ? 'text' : 'password'}`}
                    id="password"
                    name='password'
                    value={password}
                    onChange={changeHandler}
                    className='border-[1px] border-slate-300 rounded-md block text-xs   md:text-sm text-black w-full py-2 px-4' />
                <button type='button' className='absolute right-0 -translate-y-7 right-3 opacity-50' onClick={() => setShowPass(!showPass)}>
                    {!showPass ? <FaEye /> : <FaEyeSlash />}
                </button>

                {errors.password && <span className='text-xs text-red-500'>{errors.password}</span>}
            </fieldset>

            <p className="text-xs mb-8 font-medium text-slate-500">
                By creating an account you agree with our Terms of Service, Privacy Policy,
            </p>
            <button type="submit" className='bg-black text-white py-2 px-4 rounded text-center text-xs  md:text-sm cursor-pointer w-full'>Create Account</button>
        </form>
    )
}

export default SignUpForm