import { useLocation } from 'react-router-dom'
import CustomNavLink from '../CustomNavLink'

type Props = {
    rootLink?: string,
    alias?: string
}

const BreadCrumbs = ({ rootLink, alias }: Props) => {

    let pathname = useLocation().pathname
    if (alias) pathname = '/' + alias
    if (rootLink) {
        pathname = '/' + rootLink + pathname
    }

    let links = ''

    const matches = pathname.split('/').filter(str => str !== '')
    const crumb = matches.map((url, index) => {

        const uurl = url === rootLink ? '' : url
        links += '/' + uurl
        links = links.replaceAll('//', '/')
        return (
            <div key={index} className='flex items-center gap-x-2'>
                <CustomNavLink isDisabled={index === matches.length - 1 && true} to={links} cssClass={`text-sm  capitalize ${matches.length !== index + 1 ? 'font-medium text-slate-500' : 'font-bold'}`}>
                    {url.replaceAll('-', ' ')}
                </CustomNavLink>
                {matches.length !== index + 1 ? (<span className=" w-3 h-3 border-t-2 border-r-2 border-slate-600 rotate-45"></span>) : ''}
            </div>)
    }
    )

    return (
        <div className="flex items-center text-slate-700 gap-x-3">
            {crumb}
        </div>
    )
}

export default BreadCrumbs