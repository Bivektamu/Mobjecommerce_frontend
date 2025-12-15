import {  ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Close from '../ui/Close'

type Props = {
    close: () => void
    children: ReactNode
    isOpen: boolean
}

const Modal = ({ children, close, isOpen }: Props) => {
    const portalRoot = document.getElementById('root')

    useEffect(()=> {
        if(isOpen) {
            document.body.style.overflow = 'hidden'
        }
        else {
            document.body.style.overflow = 'initial'
        }
    }, [isOpen])

    if (!portalRoot || !isOpen) return null
    return createPortal(
        <section className='w-full h-dvh fixed top-0 left-0 bg-black/30 z-50 flex items-center justify-center px-4 py-8 '>
            <div className='px-4 py-8 md:p-12 bg-white rounded-lg w-full md:w-[500px] max-w-full text-center relative max-h-full overflow-auto'>
                <button className='size-3 md:size-6 absolute right-2 md:right-4 top-4' onClick={close}>
                    <Close classN='bg-black w-full' />
                </button>
                {children}
            </div>
        </section>, portalRoot
    )
}

export default Modal