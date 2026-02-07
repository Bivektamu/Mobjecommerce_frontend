type Props = {
    col?: string,
    cssClass?: string
}

const TextLoader = ({ col="1", cssClass="" }: Props) => {
    return (
        <p className={`flex ${cssClass} ${col === "1" ?'':' container'}`}>
            {
                new Array(parseInt(col)).fill('*').map((_, i) => <span key={`text_loader_${i}`} className={`w-full bg-slate-200 animate-pulse h-full`}>&nbsp;</span>)
            }
        </p>
    )
}

export default TextLoader