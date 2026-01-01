import { ReactElement, useState } from 'react'
import { Address, Toast, Toast_Vairant } from '../../store/types'
import Modal from '../layout/Modal'
import ShippingForm from '../forms/ShippingForm'
import { useMutation } from '@apollo/client'
import { DELETE_ADDRESS_BY_ID } from '../../data/mutation/users.mutation'
import { v4 } from 'uuid'
import { addToast } from '../../store/slices/toastSlice'
import { useStoreDispatch } from '../../store'
import { GET_USER_ADDRESSES } from '../../data/query/user.query'

interface Props {
    address: Address
}

const AddressItem = ({ address }: Props) => {
    const dispatch = useStoreDispatch()


    const [modal, setModal] = useState<ReactElement | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [deleteAddressById] = useMutation(DELETE_ADDRESS_BY_ID, {
        refetchQueries: [
            { query: GET_USER_ADDRESSES }
        ],
        onCompleted: () => {
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.SUCCESS,
                msg: `${address.label} Address successfully deleted`
            }
            dispatch(addToast(newToast))
        },
        onError: (error) => {
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.WARNING,
                msg: error.message
            }
            dispatch(addToast(newToast))
        }
    })

    const editHandler = () => {
        setShowModal(true)
        setModal(<ShippingForm addressId={address.id as string} closeModal={() => setShowModal(false)} />)
    }

    const deleteAddress = () => {
        setShowModal(false)
        deleteAddressById({
            variables: {
                deleteAddressId: address.id
            }
        })

    }

    const deleteHandler = () => {

        const content = (
            <div className='text-center'>
                <p className="mb-6 font-medium md:text-sm text-xs">
                    Are you sure you want to delete <span className="bg-gray-300 text-black font-medium  text-sm border rounded py-1 px-2 uppercase">{address.label}</span>  address?</p>
                <div className="flex gap-x-4 justify-center">
                    <button className='bg-black text-white px-4 py-2 rounded' onClick={() => setShowModal(false)}>Cancel</button>
                    <button className='border-slate-600 border px-4 py-2 rounded' onClick={() => deleteAddress()}>Delete</button>
                </div>
            </div>
        )
        setShowModal(true)
        setModal(content)

        // dispatch(deleteCart(cartItem.id))
    }


    const { building, label, street, city, postcode, country, state } = address
    return (
        <div className='flex justify-between items-start border p-4 rounded shadow gap-6'>
            <div>
                <div className="flex gap-4 mb-4">
                    <span className='font-semibold block capitalize '>{label}</span>
                    {
                        address.setAsDefault && <span className='text-xs  border-[1px] bg-slate justify-center  py-1 px-4 text-slate-400 rounded-full'>Default</span>
                    }

                </div>
                {building && <p>{building}</p>}
                <p className='text-sm'>
                    {street}<br />
                    {city}, {state}, {postcode}<br />
                    {country}</p>
            </div>
            <div className='flex gap-4'>
                <button
                    onClick={editHandler}
                    className='md:text-sm text-xs  border-[1px] border-black justify-center flex items-center rounded py-1 px-4'>
                    Edit
                </button>
                <button
                    disabled={address.setAsDefault}
                    onClick={deleteHandler}
                    className={`md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4  ${address.setAsDefault ? 'pointer-none bg-cultured text-slate-400' : 'text-white'}`}>
                    Delete
                </button>
            </div>

            {
                <Modal isOpen={showModal} close={() => setShowModal(false)} >
                    {modal!}
                </Modal>
            }

        </div>
    )
}


export default AddressItem