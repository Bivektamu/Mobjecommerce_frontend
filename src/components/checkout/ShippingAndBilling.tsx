import { GET_USER_ADDRESSES } from '../../data/query/user.query';
import { Address, BillingDetails, CheckOutDetails, Role } from '../../store/types'
import { useQuery } from '@apollo/client';
import { GoCheckbox } from 'react-icons/go';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import BillingForm from '../../components/forms/BillingForm';
import { ChangeEvent, memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { stripTypename } from '@apollo/client/utilities';
import ShippingForm from '../forms/ShippingForm';
import Modal from '../layout/Modal';
import TileLoader from '../ui/TileLoader';
import { useAuth } from '../../store/slices/authSlice';

interface Props {
    setCheckOutDetails: React.Dispatch<React.SetStateAction<CheckOutDetails>>,
    checkoutDetails: CheckOutDetails
}

const ShippingAndBilling = memo(({ setCheckOutDetails, checkoutDetails }: Props) => {

    const { user } = useAuth()
    const { data, loading } = useQuery(GET_USER_ADDRESSES)

    const [modalContent, setModalContent] = useState<ReactElement | null>(null)

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [selectedOption, setSelectedOption] = useState('Choose shipping address')
    const [billingCheck, setBillingCheck] = useState(true);

    const { shipping, billing, items, email } = checkoutDetails


    useEffect(() => {
        if (billingCheck && shipping) {
            const { id, label, setAsDefault, ...rest } = shipping
            const billing = rest as BillingDetails
            setCheckOutDetails(prev => ({
                ...prev, billing: {
                    ...billing,
                }
            }))
        }
        else if (!billingCheck) {
            setCheckOutDetails(prev => ({ ...prev, billing: null }))
        }
    }, [shipping, billingCheck])



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
            setSelectedOption(`${selectedAddress.building ? selectedAddress.building + ',' : ''} ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postcode}, ${selectedAddress.country}`)
            setCheckOutDetails(prev => ({ ...prev, shipping: selectedAddress }))
        }

    }, [selectedAddress, setCheckOutDetails])

    const changeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedAddress(userAddresses[e.target.selectedIndex])
    }

    const addAddressHandler = () => {
        setModalContent(<ShippingForm closeModal={() => setModalContent(null)} />)
    }

    const guestShippingHandler = () => {
        setModalContent(<ShippingForm closeModal={() => setModalContent(null)} setShipping={(shipping: Address) => setCheckOutDetails(prev => ({
            ...prev,
            shipping
        }))} />)
    }


    const guestBillingHandler = () => {
        setModalContent(
            <BillingForm closeModal={() => setModalContent(null)} setBilling={(billing: BillingDetails) => setCheckOutDetails(prev => ({
                ...prev,
                billing
            }))} />
        )
    }



    const checkHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (e.target.type === 'checkbox') {
            setBillingCheck(e.target.checked)
        }

    }

    return (
        <div className={`${!user && 'pt-8 border-t'}`}>
            <p className='font-semibold md:text-xl text-lg  mb-4'>Shipping Address</p>

            {
                (user && user.role === Role.CUSTOMER) ?
                    loading ? <TileLoader /> : (
                        <>

                            {
                                userAddresses.length > 0 &&
                                <div>
                                    <p className="font-light  text-xs  border-slate-200 mb-2">Select a shipping address</p>

                                    <select
                                        id="selectedAddress"
                                        name="selectedAddress"
                                        defaultValue={selectedOption}
                                        className='border-[1px] outline-none px-3 bg-slate-50 py-2 rounded  md:text-sm text-xs '
                                        onChange={changeHandler}>
                                        {userAddresses.map((add: Address) => <>
                                            <option key={add.id}>
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
                                <button className='md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4 text-white' onClick={addAddressHandler}>Add Address</button>

                            </div>
                        </>
                    )
                    :
                    <>
                        {shipping &&
                            <p className="border-[1px] outline-none max-w-[400px] w-full px-3 bg-slate-50 py-2 rounded  md:text-sm text-xs placeholder:font-normal capitalize mb-4" >{`${shipping.building ? shipping.building + ',' : ''} ${shipping.street}, ${shipping.city}, ${shipping.state}, ${shipping.postcode}, ${shipping.country}`}</p>
                        }

                        <div className='flex gap-4 items-center'>

                            <span className='text-xs italic text-slate-400 font-light'>
                                {
                                    !shipping ? 'Please add shipping address' : 'Want to edit shipping address?'
                                }

                            </span>
                            <button className='md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4 text-white' onClick={guestShippingHandler}>{shipping ? 'Edit' : 'Add'} Shipping</button>

                        </div>

                    </>
            }

            <br />
            <br />

            {
                shipping &&
                <div className='mb-8'>
                    <label htmlFor="billingCheck" className="text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full flex items-center gap-2">
                        Billing address same as shipping address

                        {billingCheck ? <GoCheckbox className="size-6" /> : <MdOutlineCheckBoxOutlineBlank className="size-6" />}
                    </label>
                    <input
                        onChange={e => checkHandler(e)}
                        type="checkbox"
                        id="billingCheck"
                        name="billingCheck"
                        className="appearance-none hidden" />
                </div>
            }

            {
                !billingCheck &&

                <>
                    <h4 className="font-semibold md:text-xl text-lg pt-10 border-t  mb-4">Billing Address</h4>
                    {billing &&
                        <p className="border-[1px] outline-none w-fit px-3 bg-slate-50 py-2 rounded  md:text-sm text-xs placeholder:font-normal capitalize mb-4" >{`${billing.building ? billing.building + ',' : ''} ${billing.street}, ${billing.city}, ${billing.state}, ${billing.postcode}, ${billing.country}`}</p>
                    }
                    <div className='flex gap-4 items-center'>

                        <span className='text-xs italic text-slate-400 font-light'>
                            {
                                !billing ? 'Please add billing address' : 'Want to edit billing address?'
                            }

                        </span>
                        <button className='md:text-sm text-xs  border-[1px] bg-black justify-center flex items-center rounded py-1 px-4 text-white' onClick={guestBillingHandler}>{billing ? 'Edit' : 'Add'} billing</button>

                    </div>
                </>
            }

            {
                <Modal isOpen={!!modalContent} close={() => setModalContent(null)} >
                    {modalContent}
                </Modal>
            }

        </div>
    )
}
)

export default ShippingAndBilling