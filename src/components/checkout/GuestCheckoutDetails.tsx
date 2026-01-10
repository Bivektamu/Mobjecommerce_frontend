import React from 'react'

const GuestCheckoutDetails = () => {
    return (
        <div className='mb-16'>
            <h4 className="text-left font-semibold md:text-xl text-lg mb-4">Contact Information</h4>

            <fieldset>
                <label htmlFor="email" className='capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full'>Email</label>
                <input
                    type='text'
                    className='border-[1px] outline-none bg-slate-50 block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal capitalize'
                    value={email}
                    onChange={(e) => setCheckOutDetails(prev => ({
                        ...prev,
                        email: e.target.value
                    }))} />
            </fieldset>
        </div>
    )
}

export default GuestCheckoutDetails