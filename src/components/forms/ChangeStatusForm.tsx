import { MouseEvent, useState } from 'react'
import { Order_Status, Toast, Toast_Vairant } from '../../store/types'
import { v4 as uuidv4 } from 'uuid';
import { addToast } from '../../store/slices/toastSlice';
import { useMutation } from '@apollo/client';
import { UPDATE_ORDER_STATUS } from '../../data/mutation';
import { useStoreDispatch } from '../../store';

type Props = {
    id: string,
    refetch?: ()=>void,
    closeModal?:() => void
}
const ChangeStatusForm = ({ id, refetch, closeModal }: Props) => {

    const [updateStatus, { loading }] = useMutation(UPDATE_ORDER_STATUS)

    const dispatch = useStoreDispatch()

    const [newStatus, setNewStatus] = useState<Order_Status | null>(null)

    const saveHandler = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        console.log(newStatus, id)

        if (!newStatus) {
            const newToast: Toast = {
                id: uuidv4(),
                variant: Toast_Vairant.DANGER,
                msg: 'Please select a status'
            }
            dispatch(addToast(newToast))
        }
        else {

            try {

                const { data } = await updateStatus({
                    variables: {
                        input: {
                            id,
                            status: newStatus
                        }
                    }
                })

                if (data) {
                    const newToast: Toast = {
                        id: uuidv4(),
                        variant: Toast_Vairant.SUCCESS,
                        msg: 'Order status updated successfuly'
                    }
                    dispatch(addToast(newToast))

                    refetch?.()
                    closeModal?.()
                }
            }

            catch (error) {
                if (error instanceof Error) {
                    const newToast: Toast = {
                        id: uuidv4(),
                        variant: Toast_Vairant.WARNING,
                        msg: error.message
                    }
                    dispatch(addToast(newToast))
                }

            }
        }

    }
    return (
        <div className='text-left'>
            <p className="mb-6 font-medium text-sm">Change the order status to:</p>
            <div className="grid grid-cols-3 items-center justify-between  gap-6">
                <select name="status" id="status" className='py-2 col-span-2 px-4 border-[1px] border-slate-600 rounded outline-none appearance-none capitalize text-xs lg:text-sm' onChange={e => { e.preventDefault(), e.stopPropagation(), setNewStatus(e.target.value as Order_Status) }}>
                    <option className='' value="" hidden>Choose a new status</option>
                    {
                        Object.keys(Order_Status).map(key =>
                            <option className='' key={key} value={key}>{key.toLowerCase()}</option>
                        )
                    }
                </select>
                <button type="button" disabled={loading ? true : false} className={`min-w-[100px] bg-black text-sm text-white py-2 px-4 rounded text-center cursor-pointer `} onClick={saveHandler}>{loading?'Updating':'Update'}</button>
            </div>
        </div >
    )
}

export default ChangeStatusForm