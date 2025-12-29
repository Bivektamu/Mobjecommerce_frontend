import { Toast } from '../../store/types'
import ToastCard from './ToastCard'

type Props = {
    toasts: Toast[]
}

const ToastComponent = ({ toasts }: Props) => {
    return (
        <div className=' fixed top-10 right-0 z-10 flex flex-col gap-4 items-center justify-center z-20'>
            {
                toasts.map(toast => <ToastCard key={toast.id as string} toast={toast} />)
            }
        </div>
    )
}

export default ToastComponent