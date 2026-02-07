
type Props = {
    square: number,
    squareClass?: string
    cssClass?: string
}
const SquareLoader = ({ square = 1, squareClass='', cssClass='' }: Props) => {

        return (
            <div className={`container mx-auto flex gap-4 ${cssClass}`}>
                {
                    new Array(square).fill('*').map((_, i) => <div key={i} className={`${squareClass} rounded-lg bg-slate-200 animate-pulse`} />)
                }
            </div>

        )
}

export default SquareLoader