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


    useEffect(() => {
        if (data?.user) {
            setAvatarEmail(data.user.email)
        }

    }, [data, setAvatarEmail])



    if (loading) {
        return <ProgressLoader />
    }

    const user = data?.user
    return (
        <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="rounded-full w-8 h-8 overflow-hidden">
                {avatar}
            </span>
            {
                user ? <span>
                    {user?.firstName} {user?.lastName}
                </span>:
                <span>Inactive User</span>
            }

        </div>
    )
}

export default UserInfo