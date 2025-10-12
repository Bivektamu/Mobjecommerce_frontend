import { useEffect, useState } from 'react'
import gravatar from 'gravatar'

import client from '../../data/client'
import { GET_USER_EMAIL } from '../../data/query/user.query'
import { Status } from '../../store/types'
import AvatarPlaceholder from './AvatarPlaceholder'
type Props = {
    id: string
}

const UserAvatar = ({ id }: Props) => {

    const [emailApi, setEmailApi] = useState({
        error: '',
        email: '',
        status: Status.PENDING
    })

    useEffect(() => {


        const getUserEmailFunc = async (id: string) => {
            const { error, data } = await client.query({
                query: GET_USER_EMAIL,
                variables: { userEmailId: id }
            })


            if (error) {
                setEmailApi({
                    error: error.message,
                    email: '',
                    status: Status.REJECTED
                })
            }

            setEmailApi({
                error: '',
                email: data.userEmail,
                status: Status.FULFILLED
            })
        }
        if (id) {
            getUserEmailFunc(id)
        }

    }, [id])


    const { error, email } = emailApi


    if (error) {
        return <AvatarPlaceholder />
    }

    return (
        <img className='w-10 h-10 rounded-full block' src={gravatar.url(email, { s: '200', r: 'pg', d: 'mp' })} />
    )
}

export default UserAvatar