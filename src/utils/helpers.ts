
export const getAverageRating = ( ratings : number[]) => {
    if (ratings) {
        return Number((ratings.reduce((sum, rating) => rating as number + sum, 0) / ratings.length).toFixed(1))
    }
    return 0
}
