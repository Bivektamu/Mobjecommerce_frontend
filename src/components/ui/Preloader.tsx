import { ReactElement } from "react"

interface Props {
  children?:ReactElement
}
const Preloader = ({children}:Props) => {
  return (
    <section id='preloader'
      className='fixed w-full z-20 h-dvh  top-0 left-0 bg-cultured'>
        <div className="w-full h-full bg-slate-200 animate-pulse">
        </div>
        {children && children}
    </section>
  )
}

export default Preloader