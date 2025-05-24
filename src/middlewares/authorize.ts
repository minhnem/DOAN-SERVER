export const authorize = (allowedRules: number[]) => {
    return (req: any, res: any, next: any) => {
        const userRule = req.rule
        //console.log(req.rule)
        if (!allowedRules.includes(userRule)) {
            return res.status(403).json({
                error: "Bạn không có quyền truy cập chức năng này"
            })
        }

        next()
    }
}