import { Colour } from "../store/types";

const getClasses = (colour: Colour) => {
    let bgClass = '', borderClass = ''
    switch (colour) {
        case Colour.BLACK:
            bgClass = 'bg-black'
            borderClass = 'border-black'
            break;
        case Colour.RED:
            bgClass = 'bg-red-600'
            borderClass = 'border-red-600'
            break;
        case Colour.AMBER:
            bgClass = 'bg-amber-300'
            borderClass = 'border-amber-300'
            break;
        case Colour.GRAY:
            bgClass = 'bg-gray-600'
            borderClass = 'border-gray-600'
            break;
        case Colour.WHITE:
            bgClass = 'bg-regal-white'
            borderClass = 'border-cultured'
            break;

        default:
            break;
    }

    return {
        bgClass,
        borderClass
    }
}

export default getClasses