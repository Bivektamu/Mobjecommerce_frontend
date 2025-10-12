import { useEffect } from 'react'
import useAvatar from '../../../hooks/useAvatar'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../../../../data/query/user.query'
import ProgressLoader from '../../../ui/ProgressLoader'
type Props = {
    id: string
}
const UserInfo = ({ id }: Props) => {
    const { avatar, setAvatarEmail } = useAvatar()


    const { loading, data } = useQuery(GET_USER, {
        variables: {
            userId: id
        }
    })

    const user = data?.user

    useEffect(() => {
        if (user) {
            setAvatarEmail(user.email)
        }

    }, [user])



    if (loading) {
        return <ProgressLoader />
    }

    return (
        <div className="text-xs text-slate-500 col-span-2 flex items-center gap-2">
            <span className="rounded-full w-8 h-8 overflow-hidden">
                {avatar}
            </span>
            <span>
                {user.firstName} {user.lastName}
            </span>
        </div>
    )
}

export default UserInfo