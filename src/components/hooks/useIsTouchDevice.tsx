import { useEffect, useState } from "react"

const useIsTouchDevice = () => {
    const [isTouch, setIsTouch] = useState(false)

    useEffect(()=> {
        const media = window.matchMedia('(pointer:coarse)')
        console.log(media)
        setIsTouch(media.matches)
    }, [])

    return isTouch
}

export default useIsTouchDevice