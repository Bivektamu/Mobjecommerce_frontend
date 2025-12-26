import { ErrorCode, Toast_Vairant } from "../store/types"

export const getAverageRating = (ratings: number[]) => {
    if (ratings) {
        return Number((ratings.reduce((sum, rating) => rating as number + sum, 0) / ratings.length).toFixed(1))
    }
    return 0
}

export const getToastVariant = (errorCode: ErrorCode) => {
    switch (errorCode) {
        case ErrorCode.BAD_CREDENTIALS:
        case ErrorCode.NOT_AUTHENTICATED:
        case ErrorCode.JWT_TOKEN_EXPIRED:
        case ErrorCode.JWT_TOKEN_INVALID:
        case ErrorCode.JWT_TOKEN_MISSING:
        case ErrorCode.USER_NOT_FOUND:
        case ErrorCode.INTERNAL_SERVER_ERROR:
        case ErrorCode.NETWORK_ERROR:
        case ErrorCode.GOOGLE_ERROR:
            return Toast_Vairant.DANGER

        case ErrorCode.SHIPPING_ADDRESS_ERROR:
        case ErrorCode.WRONG_USER_TYPE:
        case ErrorCode.VALIDATION_ERROR:
        case ErrorCode.INPUT_ERROR:
            return Toast_Vairant.WARNING

        case ErrorCode.NOT_FOUND:
            return Toast_Vairant.INFO

        default:
            return Toast_Vairant.DANGER
    }
}