type Props = {
    classN?:string
}

const Check = ({classN='relative'}: Props) => {
  
  return (
    
    // <span className={`flex m-auto items-center justify-center w-2 h-4 relative rotate-45 border-b-2 border-r-2 border-black ${classN}`}>
    <span className={`inline-block relative left-2 w-2 h-4 relative rotate-45 border-b-2 border-r-2 border-black ${classN}`}>

    </span>
  )
}

export default Check