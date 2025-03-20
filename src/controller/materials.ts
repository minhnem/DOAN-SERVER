
import CategoryMaterialsModel from "../models/CategoryMaterialsModel"
import MaterialsModel from "../models/MaterialsModel"

// Materials
const getMaterials = async (req: any, res: any) => {
    const {title, page, pageSize} = req.query
    const filter: any = {}
    if(title) {
        filter.slug = {$regex: title}
    }
    filter.isDeleted = false
    try {
        const skip = (page - 1) * pageSize
        const products = await MaterialsModel.find(filter).skip(skip).limit(pageSize).lean()
        const totalProduct = await MaterialsModel.find({isDeleted: false})
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

const getAllMaterials = async (req: any, res: any) => {
    try {
        const product = await MaterialsModel.find({})
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

const getMaterialsDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const product = await MaterialsModel.findById(id)
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

const addMaterials = async (req: any, res: any) => {
    const body = req.body
    try {

        const item = await MaterialsModel.findOne({slug: body.slug})

        if(item) {
            throw new Error('Nguyên liệu này đã tồn tại.')
        }

        const newProduct = new MaterialsModel(body)
        await newProduct.save()
        
        res.status(200).json({
            message: 'Thêm nguyên lệu thành công',
            data: newProduct
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const deleteMaterials = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await MaterialsModel.findByIdAndUpdate(id, {isDeleted: true})
        res.status(200).json({
            message: 'Xóa nguyên liệu thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

const updateMaterials = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const product = await MaterialsModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa nguyên liệu thành công.',
            data: product
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

const filterMaterials = async (req: any, res: any) => {
    const body = req.body
    const {categories, price} = body
    try {
        const filter: any = {}
        if(categories && categories.length > 0) {
            filter.categories = {$in: categories}
        }
        if(price && price.length > 0) {
            filter.price = {$gt: price[0], $lt: price[1]}
        }
        const product = await MaterialsModel.find(filter)
        res.status(200).json({
            message: 'Sửa nguyên liệu thành công.',
            data: product
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message 
        })
    }
}

// Category
const addCategoryMaterials = async (req: any, res: any) => {
    const body = req.body
    const {parentId, slug} = body
    try {
        const category = await CategoryMaterialsModel.findOne({
            parentId: parentId,
            slug: slug
        })

        if (category) {
            throw Error('Danh mục đã tồn tại.')
        }

        const newCategory = new CategoryMaterialsModel(body)
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

const getCategoriesMaterials = async (req: any, res: any) => {
    const {page, pageSize} = req.query
    try {
        const skip = (page -1) * pageSize
        const categories = await CategoryMaterialsModel.find({$or: [{isDeleted: false}, {isDeleted: null}]}).skip(skip).limit(pageSize)
        const total = await CategoryMaterialsModel.countDocuments()
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

const getAllCategoriesMaterials = async (req: any, res: any) => {
    try {
        const categories = await CategoryMaterialsModel.find({$or: [{isDeleted: false}, {isDeleted: null}]})
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

const getCategoryMaterialsDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const category = await CategoryMaterialsModel.findById(id)
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
    const categories = await CategoryMaterialsModel.find({parentId: id})
    if(categories.length > 0) {
        categories.forEach( async (item: any) => await findAndDeleteCategoryInProduct(item._id))
    }
    await handleRemoveCategoryInProduct(id)
}

const handleRemoveCategoryInProduct = async (id: string) => {
    const products = await MaterialsModel.find({categories: {$all: id}})
        if(products && products.length > 0){
            products.forEach( async (element: any) => {
                const cats = element._doc.categories
                const index = cats.findIndex((item: string) => item === id)
                
                if(index !== -1) {
                    cats.splice(index, 1)  
                }
                await MaterialsModel.findByIdAndUpdate(element._id, {categories: cats})
            })
        }
}

const deleteCategoriesMaterials = async (req: any, res: any) => {
    const { id, isDeleted } = req.query 
    try {
        await findAndDeleteCategoryInProduct(id)
        
        if (isDeleted) {
            await CategoryMaterialsModel.findByIdAndUpdate(id, {isDeleted: true})
        } else {
            await CategoryMaterialsModel.findByIdAndDelete(id)
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

const updateCategoryMaterials = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        
        await CategoryMaterialsModel.findByIdAndUpdate(id, body)
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
    addCategoryMaterials, 
    getCategoriesMaterials,
    getAllCategoriesMaterials, 
    getCategoryMaterialsDetail, 
    deleteCategoriesMaterials, 
    updateCategoryMaterials, 
    getMaterials, 
    addMaterials, 
    deleteMaterials,
    updateMaterials,
    getMaterialsDetail,
    getAllMaterials,
    filterMaterials,
}