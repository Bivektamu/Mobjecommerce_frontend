import { ChangeEvent, useEffect, useState } from 'react'
import SearchIcon from '../ui/SearchIcons'
import { Link } from 'react-router-dom'
import { Product } from '../../store/types'

type Props = {
    data: Product[]
}

const Search = ({ data }: Props) => {

    const [text, setText] = useState('')
    const [filteredDataList, setFilteredList] = useState<Product[]>([])
    const [isFocus, setIsFocus] = useState(false)

    useEffect(() => {
        if (text.length > 0) {
            const filteredData = data.filter((item) => item.title.toLowerCase().includes(text.toLowerCase()))
            if (filteredData.length > 0) {
                setFilteredList([...filteredData])
            }
            else {
                setFilteredList([])
            }
        }
        else {
            setFilteredList([])
        }
    }, [text, data])

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setText(e.target.value)
    }

    const blurHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setTimeout(() => setIsFocus(false), 200)

    }

    return (
        <div className='relative'>
            <SearchIcon />
            <input
                onBlur={blurHandler}
                onFocus={() => setIsFocus(true)}
                type='text'
                className='text-black py-2 px-4 rounded cursor-pointer border-slate-400 border-[1px] text-sm text-left outline-none pl-10' value={text}
                onChange={changeHandler}
                placeholder='Search products' />
            {filteredDataList.length > 0 &&
                <div className={`absolute top-10 left-0 bg-white w-full rounded shadow-md z-20 ${isFocus ? '' : 'hidden'}`}>
                    {filteredDataList.map((item) => (
                        <Link to={`/collections/${item.slug}`} key={item.id} className='p-2 hover:bg-cultured cursor-pointer text-sm block'>
                            {item.title}
                        </Link>
                    ))}
                </div>
            }

        </div>
    )
}

export default Search