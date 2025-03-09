import UserModel from "../models/UserModel"
import bcrypt from 'bcrypt'
import { getAccesstoken } from "../utils/getAccesstoken"

const register = async (req: any, res: any) => {
    const body = req.body
    const {email, password} = body
    try {
        const item = await UserModel.findOne({email})
        if(item) {
            throw new Error('Email này đã tồn tại!!!')
        }
        const salt = await bcrypt.genSalt(10)
        const hashPasword = await bcrypt.hash(password, salt)
        body.password = hashPasword
        const user: any = new UserModel(body)
        await user.save()
        delete user._doc.password

        const accesstoken = await getAccesstoken({_id: user._id, email: email, rule: user.rule})

        res.status(200).json({
            message: 'Đăng ký tài khoản thành công.',
            data: {
                ...user._doc,
                accesstoken
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const login = async (req: any, res: any) => {
    const body = req.body
    const {email, password} = body
    try {
        const item: any = await UserModel.findOne({email})
        if(!item) {
            throw new Error('Tài khoản không tồn tại!!!')
        }

        const isMatchPassword = await bcrypt.compare(password, item.password)
        if(isMatchPassword) {
            throw new Error('Sai Tài khoản hoặc mật khẩu!!!')
        }

        const accesstoken = await getAccesstoken({_id: item._id, email: item.email, rule: item.rule})

        res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                ...item._doc,
                accesstoken
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {register, login}