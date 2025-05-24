export const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => + r.rating, 0)
    return (total / reviews.length).toFixed(1)
}