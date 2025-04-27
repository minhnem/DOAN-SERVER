import BillModel from "../models/BillModel"
import DishModel from "../models/DishModel"
import MaterialsModel from "../models/MaterialsModel"
import ReservationModel from "../models/ReservationsModel"
import SupplierModel from "../models/SupplierModel"

const getAllData = async (req: any, res: any) => {
    try {
        const totalReservation = await ReservationModel.countDocuments()

        const material = await MaterialsModel.find({})
        const totalMaterial = material.length
        const costMaterial = material.reduce((a, b) => a + b.cost, 0)

        const totalSupplier = await SupplierModel.countDocuments()
        const rejectReservation = await ReservationModel.find({status: 'Từ chối'})
        const totalRejectReservation = rejectReservation.length
        const totalDish = await DishModel.countDocuments()

        const bills = await BillModel.find({});
        const totalBill = bills.length
        const priceBill = bills.reduce((a, b) => a + b.totalPrice, 0)
        
        res.status(200).json({
            message: 'Lấy tất cả thông tin thành công.',
            data: {
                totalBill,
                priceBill,
                totalMaterial,
                costMaterial,
                totalSupplier,
                totalDish,
                totalRejectReservation,
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getDataChart = async (req: any, res: any) => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const allBills = await getAllbillTime(startOfYear, endOfYear);

        const billsByMonth = Array.from({ length: 12 }, (_, index) => {
            const month = `${index + 1}`; 
            const billsInMonth = allBills.filter(bill => {
                const billDate = new Date(bill.createdAt);
                return billDate.getMonth() === index; 
            });
            return {
                month,
                total: billsInMonth.reduce((a, b) => a + b.totalPrice, 0),
            };
        });

        res.status(200).json({
            message: 'Lấy hóa đơn theo từng tháng thành công.',
            data: billsByMonth,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const getAllbillTime = async (startAt: Date, endAt: Date) => {
    const filter = {
        createdAt: {
            $gte: new Date(startAt.setHours(0, 0, 0, 0)),
            $lte: new Date(endAt.setHours(23, 59, 59, 999)),
        },
    };

    const bills = await BillModel.find(filter);
    return bills;
};


export { getAllData, getDataChart }