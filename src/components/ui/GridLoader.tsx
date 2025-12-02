import CardLoader from './CardLoader'

type Props = {
    col:string
}

const GridLoader = ({col}: Props) => {
  return (
    <div className={`container mx-auto grid-cols-${1} md:grid-cols-${2} lg:grid-cols-${col}  grid gap-12`}>
        {
            new Array(parseInt(col)).fill('*').map((_,i)=> <CardLoader key={i} cssClass='w-full' />)
        }
    </div>
    
  )
}

export default GridLoader