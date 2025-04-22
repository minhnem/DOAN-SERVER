import BillModel from "../models/BillModel"
import MaterialsModel from "../models/MaterialsModel"

const getTimes = (timeType: string) => {
    let start = new Date()
    let end = new Date()
    const now = new Date()

    switch (timeType) {
        case 'Tuần': {
            const currentDay = now.getDay();
            const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
            start = new Date(now);
            start.setDate(now.getDate() + mondayOffset);
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'Tháng': {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'Năm': {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31);
            end.setHours(23, 59, 59, 999);
            break;
        }
    }

    return {start, end}
}

const getData = async (start: Date, end: Date) => {
    const filter = {
        createdAt: {
            $gte: new Date(start.setHours(0, 0, 0, 0)),
            $lte: new Date(end.setHours(23, 59, 59, 999))
        }
    };

    const bills = await BillModel.find(filter);
    const totalBill = bills.length

    return {
        revenue: bills.reduce((a, b) => a + b.totalPrice, 0),
        totalBill,
        bills
    }
}

const getTimeBill = async (req: any, res: any) => {
    const {timeType} = req.query
    try {
        const dates = getTimes(timeType);
        const days: Date[] = [];
    
        if (timeType === 'Năm') {
          for (let i = 0; i < 12; i++) {
            days.push(new Date(dates.start.getFullYear(), i, 1));
          }
        } else {
          const startDate = new Date(
            dates.start.getFullYear(),
            dates.start.getMonth(),
            dates.start.getDate()
          );
          const endDate = new Date(
            dates.end.getFullYear(),
            dates.end.getMonth(),
            dates.end.getDate()
          );
    
          const msPerDay = 1000 * 60 * 60 * 24;
          const timeDiff = endDate.getTime() - startDate.getTime();
          const nums = Math.round(timeDiff / msPerDay) + 1;
    
          for (let i = 0; i < nums; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);
            days.push(day);
          }
        }

        const promises = days.map(async (day) => {
            let start: Date;
            let end: Date;

            if (timeType === 'Năm') {
                start = new Date(day.getFullYear(), day.getMonth(), 1);
                end = new Date(day.getFullYear(), day.getMonth() + 1, 0);
            } else {
                start = new Date(day);
                end = new Date(day);
            }

            return {
                date: day,
                data: await getData(start, end)
            };
        })

        let bills
        if (timeType === 'Năm') {
            const start = new Date(days[0].getFullYear(), days[0].getMonth(), 1);
            const end = new Date(days[days.length - 1].getFullYear(), days[days.length - 1].getMonth() + 1, 0);
            bills = await getAllbillTime(start, end)
        } else {
            const start = new Date(days[0]);
            const end = new Date(days[days.length - 1])
            bills = await getAllbillTime(start, end)
        }

        const results = await Promise.all(promises)
        const material = await MaterialsModel.find({})
        const costMaterial = material.reduce((a, b) => a + b.cost, 0)

        res.status(200).json({
            message: 'Cập nhật chương trình khuyến mại/giảm giá thành công.',
            data: {
                results,
                costMaterial,
                bills,
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllbillTime = async (startAt: Date, endAt: Date) => {
    const filter = {
        createdAt: {
            $gte: new Date(startAt.setHours(0, 0, 0, 0)),
            $lte: new Date(endAt.setHours(23, 59, 59, 999))
        }
    };

    const bills = await BillModel.find(filter);

    return bills
}

export {getTimeBill}