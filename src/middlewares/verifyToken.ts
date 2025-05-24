import jwt from "jsonwebtoken"

export const verifyToken = (req: any, res: any, next: any) => {
    const headers = req.headers.authorization
    const accesstoken = headers ? headers.split(" ")[1] : ""
    try {
        if(!accesstoken){
            throw new Error("Không có quyền truy cập")
        }

        const decoded: any = jwt.verify(accesstoken, process.env.SECRET_KEY as string)
        if (!decoded) {
            throw new Error("Token không hợp lệ")
        }

        req._id = decoded._id
        req.rule = decoded.rule

        next()
    } catch (error: any) {
        res.status(401).json({
            error: error.message
        })
        
    }
}
