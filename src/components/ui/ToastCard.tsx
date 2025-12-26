import Close from './Close'
import { Toast, Toast_Vairant } from '../../store/types'
import { MouseEvent, useEffect } from 'react'
import { removeToast } from '../../store/slices/toastSlice'
import DangerSvg from './DangerSvg'
import InfoSvg from './InfoSvg'
import SuccessSvg from './SuccessSvg'
import { useStoreDispatch } from '../../store'

type Props = {
    toast: Toast
}

const ToastCard = ({ toast }: Props) => {

    const dispatch = useStoreDispatch()

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id))
        }, 2000)

        return (() => clearTimeout(timer))

    }, [dispatch, toast.id])

    const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        dispatch(removeToast(toast.id))
    }

    let csName = '', spanC = '', logo
    switch (toast.variant) {
        case Toast_Vairant.SUCCESS:
            csName = 'text-green-600 bg-green-100'
            spanC = 'bg-green-600'
            logo = <SuccessSvg />
            break;
        case Toast_Vairant.INFO:
            csName = 'text-blue-600 bg-blue-100'
            spanC = 'bg-blue-600'
            logo = <InfoSvg />
            break;

        case Toast_Vairant.WARNING:
            csName = 'text-orange-600 bg-orange-100'
            spanC = 'bg-orange-600'
            logo = <InfoSvg />
            break;
        default:
            csName = 'text-red-600 bg-red-100';
            spanC = 'bg-red-600'
            logo = <DangerSvg />
            break;
    }

    return (
        <div className={csName + ' relative px-4 py-2 flex items-center gap-4'}>
            <div className='w-5 h-5'>
                {logo}
            </div>
            {toast.msg}
            <span className={`w-full absolute h-[2px] bottom-0 left-0 animate-toast-bar ${spanC}`}></span>
            <button className='w-4 h-4 relative' onClick={clickHandler} >
                <Close classN='bg-red-600' />
            </button>
        </div>)
}

export default ToastCard