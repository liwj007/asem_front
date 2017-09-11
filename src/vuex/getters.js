//test
export const getCount = state => {
    return state.count
}

export const getManageUnit = state => {
    return isNaN(state.manageUnit) ? null : state.manageUnit
}
