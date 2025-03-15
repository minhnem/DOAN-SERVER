import CategoryModel from "../models/CategoryModel"
import DishModel from "../models/DishModel"


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
            await CategoryModel.findByIdAndUpdate(id, {isDeleted: true})
        } else {
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
}