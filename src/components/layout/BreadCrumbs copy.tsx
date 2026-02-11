import { useLocation } from 'react-router-dom'
import CustomNavLink from '../CustomNavLink'
import { useMemo } from 'react'

type Props = {
    rootLink?: string,
    alias?: string
}

const BreadCrumbs = ({ rootLink = '', alias = '' }: Props) => {
    const { pathname } = useLocation()

    const crumb = useMemo(() => {
        let path = ''
        if (alias) {
            path = '/' + alias
        }
        else {
            path = pathname
        }
        if (rootLink) {
            path = '/' + rootLink + path
        }
        const matches = path.split('/').filter(str => str !== '')

        let links = ''

        const bugrerLinks = matches.map((url, index) => {
            const uurl = url === rootLink ? '' : url
            links += '/' + uurl
            links = links.replaceAll('//', '/')
            console.log(links)
            return (
                <div key={`burger_link_${index}`} className='flex items-center gap-x-2'>
                    <CustomNavLink isDisabled={index === matches.length - 1 && true} to={links} cssClass={`  capitalize ${matches.length !== index + 1 ? 'font-medium text-slate-500' : 'font-bold'}`}>
                        {url}
                    </CustomNavLink>
                    {matches.length !== index + 1 ? (<span className=" w-3 h-3 border-t-2 border-r-2 border-slate-600 rotate-45"></span>) : ''}
                </div>)
        }
        )

        return bugrerLinks

    }, [pathname, alias, rootLink])

    console.log(crumb.length)


    return (
        <div className="flex items-center text-slate-700 gap-x-3 md:text-sm text-xs">
            {crumb}
        </div>
    )
}

export default BreadCrumbs