import { useMutation, useQuery } from '@apollo/client'
import { MouseEvent, useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { GET_WISH_LIST_BY_USER_ID } from '../../data/query/reviews.query'
import { useAuth } from '../../store/slices/authSlice'
import { LikedProduct, WishList } from '../../store/types'
import { stripTypename } from '@apollo/client/utilities'
import { ADD_TO_WISH_LIST } from '../../data/mutation/reviews.mutation'
import SquareLoader from '../ui/SquareLoader'

type Props = {
    productId: string
}

const LikeButton = ({ productId }: Props) => {
    const [isLiked, setIsLiked] = useState(false)
    const [products, setProducts] = useState<LikedProduct[]>([])
    const { user } = useAuth()

    const [addToWishList] = useMutation(ADD_TO_WISH_LIST)


    const { data, loading } = useQuery(GET_WISH_LIST_BY_USER_ID, {
        variables: {
            userId: user?.id
        }
    })



    useEffect(() => {
        if (data && data.wishListByUserId) {
            const wishList: WishList = stripTypename(data.wishListByUserId)
            setProducts(wishList.products)
        }
    }, [data])

    useEffect(() => {
        if (products.length > 0) {
            const productAlreadyLiked = products.some(item => item.id === productId)
            if (productAlreadyLiked) {
                setIsLiked(true)
            }
        }


    }, [products])


    const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        let toUpdateProducts: Omit<LikedProduct, 'createdAt'>[] = products.map(item => ({ id: item.id }))


        if (isLiked) {
            toUpdateProducts = toUpdateProducts.filter(item => item.id !== productId)
        }
        else {
            toUpdateProducts = [...toUpdateProducts, { id: productId }]
        }

        addToWishList({
            variables: {
                input: {
                    products: toUpdateProducts,
                    userId: user?.id
                }
            }
        })

        setIsLiked(!isLiked)
    }

    if (loading) {
        return <SquareLoader square={1} squareClass='ml-8 inline-block' />
    }

    return (
        <button type="button" className={`ml-8 ${!user ? 'pointer-events-none' : ''}`} onClick={clickHandler}>
            {
                isLiked ?
                    <FaHeart className='w-5 h-5 relative top-1' />
                    :
                    <FaRegHeart className='w-5 h-5 relative top-1' />
            }
        </button>
    )
}

export default LikeButton