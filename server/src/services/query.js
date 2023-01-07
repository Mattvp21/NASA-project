//Gives us a useful way of paginating any endpoint
// If we return 0 as page limit, all docs will be returned
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
    //Math.abs(Absolute Value) Fancy way to turn a string into a number
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    }
}

module.exports = {
    getPagination,
}