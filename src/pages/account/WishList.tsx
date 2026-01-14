import { useMutation, useQuery } from "@apollo/client"
import { GET_WISH_LIST_BY_USER_ID } from "../../data/query/reviews.query"
import { useAuth } from "../../store/slices/authSlice"
import ProgressLoader from "../../components/ui/ProgressLoader"
import { MouseEvent, useMemo } from "react"
import { stripTypename } from "@apollo/client/utilities"
import { Link } from "react-router-dom"
import Arrow from "../../components/ui/Arrow"
import WishListItem from "../../components/wishList/WishListItem"
import { LikedProduct, WishList as WishListType } from "../../store/types"
import { ADD_TO_WISH_LIST } from "../../data/mutation/reviews.mutation"
import { Helmet } from "react-helmet-async"

const WishList = () => {
  const { user } = useAuth()

  const { data, loading } = useQuery(GET_WISH_LIST_BY_USER_ID, {
    variables: {
      userId: user?.id
    }
  })


  const [addToWishList] = useMutation(ADD_TO_WISH_LIST)

  const wishList: WishListType = useMemo(() => {
    if (!data) return {}
    return stripTypename(data.wishListByUserId)
  }, [data])

  const removeHandler = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault()
    // console.log(id)
    let toUpdateProducts: Omit<LikedProduct, 'createdAt'>[] = wishList.products.map(item => ({ id: item.id }))
    toUpdateProducts = toUpdateProducts.filter(item => item.id !== id)
    // console.log(toUpdateProducts)

    addToWishList({
      variables: {
        input: {
          products: toUpdateProducts,
          userId: wishList.userId
        }
      }
    })

  }

  if (loading) {
    return <ProgressLoader />
  }

  return (
    <div>
      <Helmet>
        <title>
          Wishlist | Manage wishlist | Mobje Commerce
        </title>
      </Helmet>
      <h2 className="font-bold mb-8">Wishlist</h2>
      <div className="mb-8 w-full lg:w-[620px]">

        {
          Object.keys(wishList).length < 1 || wishList.products.length < 1 ?
              <div  className="flex justify-center items-center h-full">
                <div className="w-max m-auto flex justify-center flex-col items-center">
                  <p className="text-slate-400 text-sm mb-8">You have yet to add product in your wish list.</p>
                  <Link to='/collections' className="bg-black text-white py-3  rounded text-center cursor-pointer text-sm flex gap-x-4 justify-center items-center w-[180px]"
                  >Start Shopping <Arrow /></Link>
                </div>
              </div>
            :

            wishList.products.map((item: LikedProduct) => <WishListItem key={item.id} item={item} removeFromWishList={removeHandler} />)
        }

      </div >

    </div >
  )
}

export default WishList