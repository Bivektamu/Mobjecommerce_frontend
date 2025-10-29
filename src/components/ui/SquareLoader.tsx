
type Props = {
    square: number,
    squareClass?: string
}
const SquareLoader = ({ square, squareClass }: Props) => {
    if (square === 1) {
        return <div className={`w-8 h-8 ${squareClass}  rounded-lg bg-slate-200 animate-pulse `} />
    }
    else

        return (
            <div className={`container mx-auto flex gap-4`}>
                {
                    new Array(square).fill('*').map((_, i) => <div key={i} className='w-8 h-8 rounded-lg bg-slate-200 animate-pulse' />)
                }
            </div>

        )
}

export default SquareLoader