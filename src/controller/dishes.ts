import CategoryModel from "../models/CategoryModel"
import DishModel from "../models/DishModel"
import { deleteFileByUrl } from "../utils/cloudinary"

// Dish
const getProducts = async (req: any, res: any) => {
    const {title, page, pageSize} = req.query
    const filter: any = {}
    if(title) {
        filter.slug = {$regex: title}
    }
    filter.isDeleted = false
    try {
        const skip = (page - 1) * pageSize
        const products = await DishModel.find(filter).skip(skip).limit(pageSize).lean()
        const totalProduct = await DishModel.find({isDeleted: false})
        const total = totalProduct.length
        res.status(200).json({
            message: 'Products',
            data: {
                products,
                total,
            },
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllProduct = async (req: any, res: any) => {
    try {
        const product = await DishModel.find({})
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        })
    } catch (error: any) {
       res.status(404).json({
        message: error.message
       }) 
    }
}

const getProductDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const product = await DishModel.findById(id)
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        })
    } catch (error: any) {
       res.status(404).json({
        message: error.message
       }) 
    }
}

const getDishByIdCategories = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const product = await DishModel.find({categories: {$in: [id]}})
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        })
    } catch (error: any) {
       res.status(404).json({
        message: error.message
       }) 
    }
}

const addProduct = async (req: any, res: any) => {
    const body = req.body
    try {

        const item = await DishModel.findOne({slug: body.slug})

        if(item) {
            throw new Error('Món ăn này đã tồn tại.')
        }

        const newProduct = new DishModel(body)
        await newProduct.save()
        
        res.status(200).json({
            message: 'Thêm món ăn thành công',
            data: newProduct
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const deleteProduct = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const item = await DishModel.findById(id)
        if(item && item.images.length > 0) {
            for(const i of item.images) {
                await deleteFileByUrl(i)
            }
        }
        await DishModel.findByIdAndUpdate(id, {isDeleted: true})
        res.status(200).json({
            message: 'Xóa món ăn thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

const findEndDeleteUrl = async (arr1: string[], arr2: string[]) => {
    if(!Array.isArray(arr1)) {
        for(const i of arr2){
            await deleteFileByUrl(i)
        }
    } else {
        const itemDelete = arr2.filter((item) => !arr1.includes(item))
        if(itemDelete.length > 0) {
            for(const i of itemDelete){
                await deleteFileByUrl(i)
            }
        }
    }
}

const updateProduct = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const item = await DishModel.findById(id)
        item && findEndDeleteUrl(body.images, item.images)
        const product = await DishModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa món ăn thành công.',
            data: product
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

const filterProduct = async (req: any, res: any) => {
    const body = req.body
    const {categories, price} = body
    try {
        const filter: any = {}
        if(categories && categories.length > 0) {
            filter.categories = {$in: categories}
        }
        if(price && price.length > 0) {
            filter.price = {$gte: price[0], $lte: price[1]}
        }
        const product = await DishModel.find(filter)
        res.status(200).json({
            message: 'Sửa món ăn thành công.',
            data: product
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

// Category
const addCategory = async (req: any, res: any) => {
    const body = req.body
    const {parentId, slug} = body
    try {
        const category = await CategoryModel.findOne({
            parentId: parentId,
            slug: slug
        })

        if (category) {
            throw Error('Danh mục đã tồn tại.')
        }

        const newCategory = new CategoryModel(body)
        await newCategory.save()

        res.status(200).json({
            message: 'Thêm mới danh mục thành công.',
            data: newCategory
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getCategories = async (req: any, res: any) => {
    const {page, pageSize} = req.query
    try {
        const skip = (page -1) * pageSize
        const categories = await CategoryModel.find({$or: [{isDeleted: false}, {isDeleted: null}]}).skip(skip).limit(pageSize)
        const total = await CategoryModel.countDocuments()
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: {
                categories,
                total
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllCategories = async (req: any, res: any) => {
    try {
        const categories = await CategoryModel.find({$or: [{isDeleted: false}, {isDeleted: null}]})
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: categories,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllCategoriesPerent = async (req: any, res: any) => {
    try {
        const categories = await CategoryModel.find({parentId: '', $or: [{isDeleted: false}, {isDeleted: null}]})
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: categories,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getCategoryDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const category = await CategoryModel.findById(id)
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: category
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const findAndDeleteCategoryInProduct = async (id: string) => {
    const categories = await CategoryModel.find({parentId: id})
    if(categories.length > 0) {
        categories.forEach( async (item: any) => await findAndDeleteCategoryInProduct(item._id))
    }
    await handleRemoveCategoryInProduct(id)
}

const handleRemoveCategoryInProduct = async (id: string) => {
    const products = await DishModel.find({categories: {$all: id}})
        if(products && products.length > 0){
            products.forEach( async (element: any) => {
                const cats = element._doc.categories
                const index = cats.findIndex((item: string) => item === id)
                
                if(index !== -1) {
                    cats.splice(index, 1)  
                }
                await DishModel.findByIdAndUpdate(element._id, {categories: cats})
            })
        }
}

const deleteCategories = async (req: any, res: any) => {
    const { id, isDeleted } = req.query 
    try {
        await findAndDeleteCategoryInProduct(id)
        
        if (isDeleted) {
            await CategoryModel.updateMany({parentId: id}, {$set: {parentId: ''}})
            await CategoryModel.findByIdAndUpdate(id, {isDeleted: true})
        } else {
            await CategoryModel.updateMany({parentId: id}, {$set: {parentId: ''}})
            await CategoryModel.findByIdAndDelete(id)
        }

        res.status(200).json({
            message: 'Xóa danh mục thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateCategory = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        
        await CategoryModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa danh mục thành công',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {
    addCategory, 
    getCategories,
    getAllCategories, 
    getCategoryDetail, 
    deleteCategories, 
    updateCategory, 
    getProducts, 
    addProduct, 
    deleteProduct,
    updateProduct,
    getProductDetail,
    getAllProduct,
    filterProduct,
    getAllCategoriesPerent,
    getDishByIdCategories,
}