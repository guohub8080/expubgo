export const or = (...args: any[]) => {
    for (const arg of args) {
        if (arg) return true
    }
    return false
}

export const and = (...args: any[]) => {
    for (const arg of args) {
        if (!arg) return false
    }
    return true
}