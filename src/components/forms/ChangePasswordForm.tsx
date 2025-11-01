import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import validateForm from '../../utils/validate'
import { ErrorCode, FormError, Toast, Toast_Vairant, ValidateSchema } from '../../store/types'
import { useMutation } from '@apollo/client'
import { CHANGE_PASSWORD } from '../../data/mutation'
import { useAuth } from '../../store/slices/authSlice'
import { v4 as uuidv4 } from 'uuid';
import { addToast } from '../../store/slices/toastSlice'
import { useStoreDispatch } from '../../store'


type FormData = {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
}

const INIT_FORM: FormData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
}

function ChangePasswordForm() {

    const { authUser } = useAuth()
    const dispatch = useStoreDispatch()



    const [changePasword, { error, data, loading }] = useMutation(CHANGE_PASSWORD)


    const [formData, setFormData] = useState<FormData>(INIT_FORM)

const [showPass, setShowPass] = useState(false)
const [errors, setErrors] = useState<FormError>({} as FormError)


useEffect(() => {
    if (error && error?.message) {
        if (error.message === ErrorCode.INPUT_ERROR) {
            setErrors(prev => ({ ...prev, currentPassword: 'Password is invalid. Please insert correct password.' }))
        }
    }
}, [error])

useEffect(() => {
    if (data && data?.changePassWord) {
        const toast: Toast = {
            id: uuidv4(),
            variant: Toast_Vairant.SUCCESS,
            msg: 'Password changed succesfully.'
        }
        dispatch(addToast(toast))
        setFormData(INIT_FORM)
    }
}, [data])

useEffect(() => {
    if (Object.keys(formData).length > 0) {
        Object.keys(formData).map(key => {
            if (formData[key as keyof typeof formData]) {
                setErrors(prev => ({ ...prev, [key]: '' }))
            }

        })
    }
}, [formData])







const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
}


const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()


    const validateSchema: ValidateSchema<unknown>[] =
        [
            {
                name: 'currentPassword',
                type: 'text',
                value: currentPassword,
                msg: 'Please enter current password'
            },
            {
                name: 'newPassword',
                type: 'password',
                value: newPassword,
                msg: 'Please insert password in correct format. Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character.'
            },
            {
                name: 'confirmNewPassword',
                type: 'text',
                value: confirmNewPassword,
                msg: 'Please confirm new password'
            }
        ]


    const newErrors: typeof errors = validateForm(validateSchema)


    if (Object.keys(newErrors).length > 0) {
        return setErrors({ ...newErrors })
    }

    if (newPassword !== confirmNewPassword) {
        return setErrors(prev => ({ ...prev, confirmNewPassword: 'Password does not match.' }))
    }

    changePasword({
        variables: {
            input: {
                id: authUser?.id,
                currentPassword,
                newPassword
            }
        }
    })
}

const { currentPassword, newPassword, confirmNewPassword } = formData

return (
    <form onSubmit={handleSubmit}>
        <fieldset className="mb-8">
            <label htmlFor="currentPassword" className="capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full">Current Password</label>
            <input
                id="currentPassword"
                name="currentPassword"
                className="border-[1px] outline-none block px-4 py-2 rounded w-full text-sm md:text-base"
                type="password"
                value={currentPassword}
                onChange={onChange}
            />
            {errors.currentPassword && <span className='text-xs text-red-500'>{errors.currentPassword}</span>}

        </fieldset>

        <fieldset className="mb-8 relative">
            <label htmlFor="newPassword" className="capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full">New Password</label>
            <input
                id="newPassword"
                name="newPassword"
                className="border-[1px] outline-none block px-4 py-2 rounded w-full text-sm md:text-base"
                type={`${showPass ? 'text' : 'password'}`}
                value={newPassword}
                onChange={onChange}
            />
            <button type='button' className='absolute right-0 -translate-y-7 right-3 opacity-50' onClick={() => setShowPass(!showPass)}>
                {!showPass ? <FaEye /> : <FaEyeSlash />}
            </button>
            {errors.newPassword && <span className='text-xs text-red-500'>{errors.newPassword}</span>}

        </fieldset>

        <fieldset className="mb-8">
            <label htmlFor="confirmNewPassword" className="capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full">Confirm New Password</label>
            <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                className="border-[1px] outline-none block px-4 py-2 rounded w-full text-sm md:text-base"
                type="password"
                value={confirmNewPassword}
                onChange={onChange}
            />
            {errors.confirmNewPassword && <span className='text-xs text-red-500'>{errors.confirmNewPassword}</span>}

        </fieldset>

        <button type='submit' className={`py-2 px-4 text-white rounded text-center w-full md:w-max  text-sm ${!loading ? 'bg-black  cursor-pointer' : 'pointer-events-none bg-slate-400 '}  `}>{loading ? 'Changing..' : 'Change Password'}</button>
    </form>
)
}

export default ChangePasswordForm