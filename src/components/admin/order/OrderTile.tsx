import { MouseEvent, ReactElement, useEffect, useState } from 'react'

import { Order } from '../../../store/types'
import getMonth from '../../../utils/getMonth'
import Modal from '../../layout/Modal'
import OrderDetails from './OrderDetails';
import ChangeStatusForm from '../../forms/ChangeStatusForm';

type Props = {
    order: Order,
    refetchOrders: () => void
}

const OrderTile = ({ order, refetchOrders }: Props) => {
    const [actionId, setActionId] = useState('')
    const [modalContent, setModalContent] = useState<ReactElement | null>(null)
    const [showModal, setShowModal] = useState(false)

    const statusHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const render: ReactElement = (
            <ChangeStatusForm id={order.id} refetch={refetchOrders} closeModal={() => setShowModal(false)} />
        )
        setModalContent({ ...render })
    }


    const detailsHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setModalContent(<OrderDetails key={order.id} order={order} />)
    }

    useEffect(() => {
        if (modalContent) {
            setShowModal(true)
        }

    }, [modalContent])

    return (
        <div className='grid grid-cols-1 lg:grid-cols-table-order px-4 lg:px-8 py-8 lg:py-4 lg:border-b-[1px] items-center gap-x-8 gap-y-2 bg-white rounded shadow lg:rounded-none lg:shadow-none'>

            <div className="grid gap-4  grid-cols-3 lg:grid-cols-1 ">
                <span className="font-semibold text-slate-500 text-sm block lg:hidden">Order Number</span>
                <span className='text-sm text-slate-500 col-span-2'>
                    {order.orderNumber}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 lg:grid-cols-1 ">
                <span className="font-semibold text-slate-500 text-sm block lg:hidden">Items</span>
                <span className='text-sm text-slate-500 col-span-2'>
                    {order.items.length}
                </span>
            </div>


            <div className="grid gap-4  grid-cols-3 lg:grid-cols-1">
                <span className="font-semibold text-slate-500 text-sm block lg:hidden">Date</span>
                <span className='text-sm text-slate-500 col-span-2'>
                    {
                        (new Date(order.orderPlaced)).getDate() + ' ' + getMonth((new Date(order.orderPlaced)).getMonth() + 1) + ' ' + (new Date(order.orderPlaced).getFullYear())
                    }
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 lg:grid-cols-1 ">
                <span className="font-semibold text-slate-500 text-sm block lg:hidden">Total</span>
                <span className='text-sm text-slate-500 col-span-2'>
                    $ {order.total}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 lg:grid-cols-1 ">
                <span className="font-semibold text-slate-500 text-sm block lg:hidden">Status</span>
                <span className={`text-sm rounded-full font-medium w-max px-4 py-1 capitalize col-span-2 ${order.status.toLowerCase()}`}>
                    {order.status.toLocaleLowerCase()}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-2 mt-4 lg:hidden">
                <button
                    className='bg-black text-white border py-2 px-4 rounded text-center cursor-pointer text-xs block '
                    onClick={statusHandler}
                >
                    Change Status
                </button>
                <button
                    className='border-slate-700 border py-2 px-4 rounded text-center cursor-pointer text-xs block'
                    onClick={detailsHandler}
                >
                    View Details
                </button>
            </div>

            <div className='text-lg text-slate-500 font-semibold relative  items-center justify-center pb-2 hidden lg:flex'>
                <button onClick={() => setActionId('id1')} >...</button>
                {actionId === 'id1' &&
                    <div className='absolute  bg-white border-[1px] rounded-lg shadow w-[140px]  -translate-x-[75px] translate-y-[35px] after:content-[""] after:size-7  after:absolute after:z-10 after:-right-5 after:-top-0' onMouseLeave={() => setActionId('')}>
                        <button onClick={statusHandler} className='block w-full text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>Change Status</button>
                        <button onClick={detailsHandler} className='block w-full text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>
                            View Details
                        </button>
                    </div>
                }
            </div>
            <Modal isOpen={showModal} close={() => setShowModal(false)} >
                {modalContent}
            </Modal>
        </div >
    )
}

export default OrderTile