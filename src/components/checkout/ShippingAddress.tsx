import { GET_USER_ADDRESSES } from '../../data/query/user.query';
import { Address, CheckOutDetails } from '../../store/types'
import { useQuery } from '@apollo/client';
import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';
import { stripTypename } from '@apollo/client/utilities';
import ShippingForm from '../forms/ShippingForm';
import Modal from '../layout/Modal';
import TileLoader from '../ui/TileLoader';

interface Props {
    setCheckOutDetails: React.Dispatch<React.SetStateAction<CheckOutDetails>>
}

const ShippingAddress = memo(({ setCheckOutDetails }: Props) => {
    const { data, loading } = useQuery(GET_USER_ADDRESSES)

    const [showModal, setShowModal] = useState(false)

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)


    const userAddresses = useMemo(() => {
        if (data?.userAddresses) {
            const { userAddresses } = stripTypename(data)
            if (userAddresses.length > 0) {
                setSelectedAddress(userAddresses.find((item: Address) => item.setAsDefault))
                return userAddresses
            }

        }
        return []
    }, [data])

    useEffect(() => {
        if (selectedAddress) {
            setCheckOutDetails(prev => ({ ...prev, shipping: selectedAddress }))
        }
       
    }, [selectedAddress, setCheckOutDetails])

    const changeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedAddress(userAddresses[e.target.selectedIndex])
    }

    return (
        <div className="">
            <p className="font-bold md:text-xl text-lg   lg:mb-12 md:mb-12 mb-6">Shipping Address</p>


            {loading ? <TileLoader /> : (
                <>

                    {
                        userAddresses.length > 0 &&
                        <div>
                            <p className="font-light  text-xs  border-slate-200 mb-2">Select a shipping address</p>

                            <select id="selectedAddress" name="selectedAddress" className='border-[1px] outline-none text-xs md:text-sm block px-2 py-2 rounded w-full' onChange={changeHandler}>
                                {userAddresses.map((add: Address) => <>
                                    <option key={add.id} selected={add.setAsDefault}>
                                        {
                                            `${add.building ? add.building + ',' : ''} ${add.street}, ${add.city}, ${add.state}, ${add.postcode}, ${add.country}`
                                        }

                                    </option>
                                </>)}
                            </select>
                        </div>

                    }
                    <br />
                    <div className='flex gap-4 items-center'>
                        <span className='text-xs italic text-slate-400 font-light'>
                            {
                                userAddresses.length > 0 ? 'Want a new shipping address' : 'Please add shipping address'
                            }
                        </span>
                        <button className='md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4 text-white' onClick={() => setShowModal(true)}>Add Address</button>

                    </div>

                 


                </>
            )}

            {
                <Modal isOpen={showModal} close={() => setShowModal(false)} >
                    {<ShippingForm closeModal={() => setShowModal(false)} />}
                </Modal>
            }

        </div>
    )
}
)

export default ShippingAddress