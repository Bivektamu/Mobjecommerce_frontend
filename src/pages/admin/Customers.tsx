// import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import UserTile from '../../components/admin/UserTile'
import SearchIcon from '../../components/ui/SearchIcons'
import { useQuery } from '@apollo/client'
import { GET_USERS } from '../../data/query/user.query'
import { Toast, Toast_Vairant, User } from '../../store/types'
import { addToast } from '../../store/slices/toastSlice';
import ProgressLoader from '../../components/ui/ProgressLoader';
import { stripTypename } from '@apollo/client/utilities';
import { useStoreDispatch } from '../../store';
import useSearch from '../../components/hooks/useSearch';

const Customers = () => {
    const dispatch = useStoreDispatch()

    const { data, loading, error, refetch } = useQuery(GET_USERS)
    const { filteredData, setParams, params } = useSearch(stripTypename(data?.users))

    if (error) {
        const newToast: Toast = {
            id: uuidv4(),
            variant: Toast_Vairant.DANGER,
            msg:error.message
        }
        dispatch(addToast(newToast))
    }

    const users: User[] = filteredData as User[]
    if (loading)
        return <ProgressLoader />

    return (

        <div className='bg-white rounded-lg'>
            <div className="flex justify-between p-4 pt-0 lg:p-8 items-center bg-regal-white lg:bg-inherit">
                <p className="font-semibold">Customers</p>
                <div className='relative'>
                    <SearchIcon />
                    <input
                        type='text'
                        className='text-black py-2 px-4 rounded cursor-pointer border-slate-400 border-[1px] text-xs md:text-sm text-left outline-none pl-10 w-[230px] md:w-[260px]'
                        value={params}
                        placeholder='Search user by name or email'
                        onChange={(e) => setParams(e.target.value)}
                    />                </div>
            </div>

            <div className='grid-cols-table-users gap-x-4 px-8 py-4 border-t-[1px] border-b-[1px] mb-6 hidden lg:grid'>
                <button>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 3.3087L3.37549 1.00035M3.37549 1.00035L5.75246 3.30726M3.37549 1.00035L3.37935 13M13 10.692L10.6238 12.9997M10.6238 12.9997L8.24754 10.692M10.6238 12.9997V1" stroke="#474B57" strokeWidth="1.14286" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <span className='text-xs md:text-sm text-slate-500 font-medium '>
                    Name
                </span>

                <span className='text-xs md:text-sm text-slate-500 font-medium'>
                    Email
                </span>

                <span className='text-xs md:text-sm text-slate-500 font-medium'>
                    Shipping Address
                </span>

                <span className='text-xs md:text-sm text-slate-500 font-medium'>
                    Registered at
                </span>


                {/* <span className='text-xs md:text-sm text-slate-500 font-medium'>
                    Verified
                </span> */}

                <span className='text-xs md:text-sm text-slate-500 font-medium'>
                    Action
                </span>
            </div>

            {
                users.length < 1 ?
                    <p className='px-8 py-8 text-slate-500'>There are no customers yet.</p>
                    :
                    <div className="w-full grid grid-cols-1 gap-y-4 lg:gap-y-0 bg-regal-white">
                        {
                            users.map(user =>
                                <UserTile key={user.id} user={user} refetchUsers={refetch} />
                            )
                        }
                    </div>

            }


        </div>
    )
}

export default Customers