// import React, { useState } from 'react'
import OrderTile from '../../components/admin/order/OrderTile'
import { useQuery } from '@apollo/client'
import { GET_ORDERS } from '../../data/query/orders.query'
import { stripTypename } from '@apollo/client/utilities'
import { Order } from '../../store/types'
import ProgressLoader from '../../components/ui/ProgressLoader'
import useSearch from '../../components/hooks/useSearch'
import SearchIcon from '../../components/ui/SearchIcons'
import { Helmet } from 'react-helmet-async'

const Orders = () => {

    const { data, loading, refetch } = useQuery(GET_ORDERS)

    const orders = stripTypename(data?.orders)
    const { filteredData, setParams, params } = useSearch(orders)


    if (loading) {
        return <ProgressLoader />
    }

    return (
        <div className='bg-white rounded-lg'>
            <Helmet>
                <title>Order Management | Manage Orders   |   Mobje Commerce</title>
            </Helmet>
            <div className="flex justify-between p-4 pt-0 lg:p-8 items-center bg-regal-white lg:bg-inherit">
                <p className="font-semibold ">Orders</p>

                <div className="flex gap-x-4 ">

                    <div className='relative'>
                        <SearchIcon />

                        <input
                            type='text'
                            className='text-black py-2 px-4 rounded cursor-pointer border-slate-400 border-[1px] text-xs text-left outline-none pl-10 w-[240px]'
                            value={params}
                            placeholder='Search orders by order number'
                            onChange={(e) => setParams(e.target.value)}
                        />
                    </div>
                    {/* <button className='border-[1px] border-slate-600 py-2 px-4 rounded text-center cursor-pointer text-sm'>Filter by</button> */}
                </div>
            </div>


            <div className='grid-cols-table-order gap-x-8 px-8 py-4 border-t-[1px] border-b-[1px] hidden lg:grid '>

                <span className='text-sm text-slate-500 font-medium '>
                    Order Number
                </span>
                <span className='text-sm text-slate-500 font-medium '>
                    Items
                </span>

                <span className='text-sm text-slate-500 font-medium'>
                    Date
                </span>

                <span className='text-sm text-slate-500 font-medium'>
                    Total
                </span>

                <span className='text-sm text-slate-500 font-medium'>
                    Status
                </span>

                <span className='text-sm text-slate-500 font-medium'>
                    Action
                </span>
            </div>

            {
                filteredData.length < 1 ?
                    <p className='px-8 py-8 text-slate-500'>There are no Orders yet.</p>
                    :
                    <div className="w-full grid grid-cols-1 gap-y-4 lg:gap-y-0 bg-regal-white">
                        {
                            (filteredData as Order[]).map((order: Order) =>
                                <OrderTile key={order.id} order={order} refetchOrders={refetch} />
                            )
                        }
                    </div>

            }


        </div>
    )
}

export default Orders