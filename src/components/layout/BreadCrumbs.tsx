import { useLocation } from 'react-router-dom'
import CustomNavLink from '../CustomNavLink'
import { useMemo } from 'react'

type Props = {
    rootLink?: string,
    alias?: string
}

const BreadCrumbs = ({ rootLink = '' }: Props) => {
    const { pathname } = useLocation()

    const crumb = useMemo(() => {
        let path = pathname
        if (rootLink) {
            path = '/' + rootLink + path
        }
        const matches = path.split('/').filter(str => str !== '')

        const bugrerLinks = matches.map((url, index) => {
            const link = ('/' + matches.slice(0, index + 1).join('/').replace('Ecommerce', '')).replaceAll('//', '/')
            return (
                <div key={`burger_link_${index}`} className='flex items-center gap-x-2'>
                    <CustomNavLink isDisabled={index === matches.length - 1} to={link} cssClass={`  capitalize ${matches.length !== index + 1 ? 'font-medium text-slate-500' : 'font-bold'}`}>
                        {url}
                    </CustomNavLink>
                    {matches.length !== index + 1 ? (<span className=" w-3 h-3 border-t-2 border-r-2 border-slate-600 rotate-45"></span>) : ''}
                </div>)
        }
        )

        return bugrerLinks

    }, [pathname, rootLink])

    return (
        <div className="flex items-center text-slate-700 gap-x-3 md:text-sm text-xs">
            {crumb}
        </div>
    )
}

export default BreadCrumbs