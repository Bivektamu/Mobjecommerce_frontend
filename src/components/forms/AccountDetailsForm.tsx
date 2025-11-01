import React, { FormEvent, useEffect, useState } from 'react'
import { CreateUserForm, User, FormError, ValidateSchema } from '../../store/types'
import validateForm from '../../utils/validate'
import { ApolloQueryResult, useMutation } from '@apollo/client'
import { UPDATE_ACCOUNT_DETAILS } from '../../data/mutation'


type Prop = {
  user: User,
  refetchQuery: ()=>Promise<ApolloQueryResult<User>>
}

const AccountDetailsForm = ({user, refetchQuery}:Prop) => {

  const [updateAccount, {loading}] = useMutation(UPDATE_ACCOUNT_DETAILS, {
    onCompleted: ()=> refetchQuery()
  })

  // console.log(user)

    const [formData, setFormData] = useState<Omit<CreateUserForm, 'password'>>({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
    })
    const [errors, setErrors] = useState<FormError>({})

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

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const submitHandler = (e:FormEvent) => {
      e.preventDefault()
        const validateSchema: ValidateSchema<unknown>[] =
            [
                {
                    name: 'firstName',
                    type: 'text',
                    value: firstName,
                    msg: 'Please insert first name'
                },
                {
                    name: 'lastName',
                    type: 'text',
                    value: lastName,
                    msg: 'Please insert last name'
                },
                {
                    name: 'email',
                    type: 'email',
                    value: email,
                },
               
            ]

        const errors = validateForm(validateSchema)

        if (Object.keys(errors).length > 0) {
            return setErrors(prev => ({ ...prev, ...errors }))
        }

        updateAccount({
          variables: {
            input: {
              firstName,
              lastName,
              email
            }
          }
        })
    }

    const { firstName, lastName, email } = formData
    return (
        <form onSubmit={submitHandler}>
            <fieldset className='mb-6'>
                <label htmlFor="firstName" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>First name</label>
                <input type="text" id="firstName" name='firstName' value={firstName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4 ' />
                {errors.firstName && <span className='text-xs text-red-500'>{errors.firstName}</span>}
            </fieldset>

            <fieldset className='mb-6'>
                <label htmlFor="lastName" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>Last name</label>
                <input type="text" name='lastName' id="lastName" value={lastName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4 ' />
                {errors.lastName && <span className='text-xs text-red-500'>{errors.lastName}</span>}
            </fieldset>

            <fieldset className='mb-6'>
                <label htmlFor="email" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>Email</label>
                <input type="text" id="email" name='email' value={email} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-sm text-black w-full py-2 px-4 ' />
                {errors.email && <span className='text-xs text-red-500'>{errors.email}</span>}
            </fieldset>

            <button className="bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm w-full md:w-max">{loading?'Saving':'Save Changes'}</button>
        </form>
    )
}

export default AccountDetailsForm