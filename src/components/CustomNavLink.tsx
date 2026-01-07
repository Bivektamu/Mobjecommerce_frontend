import { NavLink } from 'react-router-dom'

type Props = {
  to: string,
  state?: object,
  children: React.ReactNode,
  cssClass?: string,
  isNavLink?: boolean,
  isDisabled?: boolean
}

const CustomNavLink = ({ to, state, children, cssClass, isNavLink, isDisabled }: Props) => {

  if (isDisabled) {
    return (
      <span className={cssClass}>{children}</span>
    )
  }
  else
    return (
      <NavLink state={state || {}} className={({ isActive }) => `${(isActive && isNavLink) ? 'font-bold' : ''} ${cssClass}`} to={to}>{children}</NavLink>
    )
}

export default CustomNavLink