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
        <div className='grid grid-cols-table-order px-8 py-4 border-b-[1px] items-center gap-x-8'>

            <span className='text-sm text-slate-500 '>
                {order.orderNumber}
            </span>

            <span className='text-sm text-slate-500 '>
                {order.items.length}
            </span>

            <span className='text-sm text-slate-500'>
                {
                    (new Date(order.orderPlaced)).getDate() + ' ' + getMonth((new Date(order.orderPlaced)).getMonth() + 1) + ' ' + (new Date(order.orderPlaced).getFullYear())
                }
            </span>

            <span className='text-sm text-slate-500'>
                $ {order.total}
            </span>

            <span className={`text-sm rounded-full font-medium w-max px-4 py-1 capitalize ${order.status.toLowerCase()}`}>
                {order.status.toLocaleLowerCase()}
            </span>

            <button onClick={detailsHandler} className='text-sm text-slate-600 border-[1px] p-2  border-slate-600 font-medium w-[130px] rounded'>
                View Details
            </button>


            <div className='text-lg text-slate-500 font-semibold relative flex items-center justify-center pb-2'>
                <button onClick={() => setActionId('id1')} >...</button>
                {actionId === 'id1' &&
                    <div className='absolute  bg-white border-[1px] rounded-lg shadow w-[140px]  -translate-x-[75px] translate-y-[35px] after:content-[""] after:w-7 after:h-7  after:absolute after:z-10 after:-right-5 after:-top-4' onMouseLeave={() => setActionId('')}>
                        <button onClick={statusHandler} className='block w-full text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>Change Status</button>
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