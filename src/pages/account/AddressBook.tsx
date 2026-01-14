import { GET_USER_ADDRESSES } from '../../data/query/user.query';
import { Address } from '../../store/types'

import AddressItem from '../../components/checkout/AddressItem';
import ParagraphLoader from '../../components/ui/ParagraphLoader';
import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { stripTypename } from '@apollo/client/utilities';
import Modal from '../../components/layout/Modal';
import ShippingForm from '../../components/forms/ShippingForm';
import { Helmet } from 'react-helmet-async';

const AddressBook = () => {
    const { data, loading } = useQuery(GET_USER_ADDRESSES)

    const [showModal, setShowModal] = useState(false)

    const userAddresses = useMemo(() => {
        if (data?.userAddresses) {
            return stripTypename(data.userAddresses)
        }
        return []
    }, [data])

    console.log(userAddresses)

    return (
        <div className="w-full">

            <Helmet>
                <title>Addresses | Manage address book |  Mobje Commerce </title>
            </Helmet>
            <p className="font-semibold md:text-xl text-lg  border-slate-200 lg:mb-12 md:mb-12 mb-6">Shipping Address</p>

            {loading ? <ParagraphLoader /> : (
                <div className='grid grid-cols-1 gap-6'>
                    {
                        userAddresses.length < 1 ? <>
                            Please add shipping address
                        </>
                            :
                            userAddresses.map((item: Address) => <AddressItem key={item.id} address={item} />)

                    }

                </div>

            )}
            <br />
            <button className='md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4 text-white' onClick={() => setShowModal(true)}>Add Address</button>

            {
                <Modal isOpen={showModal} close={() => setShowModal(false)} >
                    {<ShippingForm closeModal={() => setShowModal(false)} />}
                </Modal>
            }

        </div>
    )
}

export default AddressBook