import { MouseEvent, useEffect, useState } from 'react'
import { Toast, Toast_Vairant, User } from '../../store/types'
import getMonth from '../../utils/getMonth'
import { v4 as uuidv4 } from 'uuid';
// import Check from '../ui/Check';
// import Close from '../ui/Close';
import useAvatar from '../hooks/useAvatar';
import { useMutation } from '@apollo/client';
import { DELETE_USER } from '../../data/mutation';
import { addToast } from '../../store/slices/toastSlice';
import { useStoreDispatch } from '../../store';
import Modal from '../layout/Modal';
// import useIsTouchDevice from '../hooks/useIsTouchDevice';
type Props = {
    user: User,
    refetchUsers: () => void
}

const UserTile = ({ user, refetchUsers }: Props) => {

    const [deleteuser] = useMutation(DELETE_USER)
    const dispatch = useStoreDispatch()

    // const [actionId, setActionId] = useState('')
    const { avatar, setAvatarEmail } = useAvatar()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {

        if (user.email) {
            setAvatarEmail(user.email)
        }
    }, [user.email])

    /*
    const updateStatus = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        // const updatedUser: UserEditInput = { ...user, isActive: !user.isActive }
        // console.log(updatedUser);
    }

    */

    // const updateVerification = (e: MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()
    //     // const updatedUser: UserEditInput = { ...user, isVerified: !user.isVerified }
    //     // console.log(updatedUser);
    // }
    const deleteHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            const { data } = await deleteuser({
                variables: {
                    deleteUserId: user.id
                }
            })

            if (data?.deleteUser) {
                const { deleteUser } = data
                console.log(deleteUser)
                if (deleteUser.success) {
                    const newToast: Toast = {
                        id: uuidv4(),
                        variant: Toast_Vairant.SUCCESS,
                        msg: 'User successfully deleted'
                    }
                    refetchUsers?.()
                    dispatch(addToast(newToast))
                    setShowModal(false)
                }
                else if (deleteUser.message) {
                    const newToast: Toast = {
                        id: uuidv4(),
                        variant: Toast_Vairant.INFO,
                        msg: deleteUser.message
                    }
                    dispatch(addToast(newToast))
                }
            }

        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                const newToast: Toast = {
                    id: uuidv4(),
                    variant: Toast_Vairant.WARNING,
                    msg: error.message
                }
                dispatch(addToast(newToast))
            }
        }

        // console.log(user.id);
    }


    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-table-users px-4 lg:px-8 py-4 border-b-[1px] items-start gap-x-4 gap-y-1 lg:gap-y-0 bg-white shadow lg:shadow-none rounded lg:rounded-none'>
                {/* <img src={gravatarUrl} className='rounded w-16 h-16' /> */}
                <div className="rounded-full size-16 lg:size-8 overflow-hidden mx-auto lg:mx-0 mb-4 md:absolute  lg:static">
                    {avatar}
                </div>
                <div className="grid gap-4 lg:gap-0 md:pl-20 lg:pl-0  grid-cols-3 lg:grid-cols-1 ">
                    <span className="font-semibold text-slate-500 text-xs md:text-sm block lg:hidden">
                        Name
                    </span>

                    <span className='text-xs md:text-sm text-slate-500 col-span-2'>
                        {user.firstName + ' ' + user.lastName}
                    </span>
                </div>

                <div className="grid gap-4 lg:gap-0 md:pl-20 lg:pl-0  grid-cols-3 lg:grid-cols-1 ">
                    <span className="font-semibold text-slate-500 text-xs md:text-sm block lg:hidden">
                        Email
                    </span>

                    <span className='text-xs md:text-sm text-slate-500 break-all col-span-2'>
                        {user.email}
                    </span>
                </div>

                <div className="grid gap-4 lg:gap-0 md:pl-20 lg:pl-0  grid-cols-3 lg:grid-cols-1 ">
                    <span className="font-semibold text-slate-500 text-xs md:text-sm block lg:hidden">
                        Shipping Address
                    </span>
                    <span className='text-xs md:text-sm text-slate-500 capitalize col-span-2 break-normal'>
                        {
                            user.address.street ? `${user.address.street}, ${user.address.city}, ${user.address.city}, ${user.address.state.toUpperCase()}, ${user.address.postcode} ` : 'Not Available'
                        }
                    </span>
                </div>


                <div className="grid gap-4 lg:gap-0 md:pl-20 lg:pl-0  grid-cols-3 lg:grid-cols-1 ">
                    <span className="font-semibold text-slate-500 text-xs md:text-sm block lg:hidden">
                        Registered Date
                    </span>
                    <span className='text-xs md:text-sm text-slate-500 col-span-2'>
                        {
                            (new Date(user.registeredDate)).getDate()
                            + ' ' +
                            getMonth((new Date(user.registeredDate)).getMonth() + 1)
                            + ' ' +
                            (new Date(user.registeredDate)).getFullYear()
                        }
                    </span>
                </div>

                <button onClick={() => setShowModal(true)} className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-xs xl:text-sm md:ml-20 lg:ml-0 mt-4 '>Delete</button>

                {/* <span className='relative pt-3'>
                    {user.isVerified ? <Check classN='w-2 h-4 border-w-2' /> : <Close classN='bg-slate-600 relative w-4' />}
                </span> */}

                {/* <div className='text-lg text-slate-500 font-semibold relative flex items-center justify-center pb-2 z-10'>
                    
                    <button onClick={() => setActionId(user.id)} >...</button>
                    {
                        actionId && isTouch && 
                        <button onClick={() => setActionId('')} className='fixed
                            top-0 left-0 w-full h-full z-[1] bg-red-400 opacity-0'>Close</button>
                    }

                    {actionId === user.id &&
                        <div className='absolute  bg-white border-[1px] rounded-lg shadow w-[140px]  -translate-x-[75px] translate-y-[35px] after:content-[""] after:size-7  after:absolute after:z-10 after:-right-5 after:-top-0 z-[2]' onMouseLeave={() => setActionId('')}>

                            <button onClick={updateVerification} className='block w-full text-xs md:text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>{user.isVerified ? 'Unverify' : 'Verify'}</button>
                            <button onClick={e => updateStatus(e)} className='block w-full text-xs md:text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                            <button onClick={() => setShowModal(true)} className='block w-full text-xs md:text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>Delete</button>
                        </div>
                    }
                </div> */}

            </div>

            <Modal isOpen={showModal} close={() => setShowModal(false)} >
                <div className='text-center'>
                    <p className="mb-6 font-medium text-xs md:text-sm">Are you sure you want to delete  {user.firstName} {user.lastName} ?</p>
                    <div className="flex gap-x-4 justify-center">
                        <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={() => setShowModal(false)}>Cancel</button>
                        <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={deleteHandler}>Delete</button>
                    </div>
                </div>
            </Modal>

        </>
    )
}

export default UserTile