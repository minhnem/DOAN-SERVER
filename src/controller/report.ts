import BillModel from "../models/BillModel"
import MaterialsModel from "../models/MaterialsModel"
import * as tf from "@tensorflow/tfjs";

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
            message: 'Lấy thông tin thành công.',
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

//====================================================================//
// Lấy doanh thu mỗi ngày liên tục trong X ngày gần nhất
const getDailyRevenue = async (daysAgo = 14) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysAgo);

  // Lấy dữ liệu gốc từ Mongo
  const rawData = await BillModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Chuyển sang Map để dễ tra cứu
  const map = new Map<string, number>();
  rawData.forEach(item => map.set(item._id, item.totalRevenue));

  // Tạo danh sách ngày đầy đủ
  const result = [];
  for (let i = 0; i < daysAgo; i++) {
    const day = new Date();
    day.setDate(day.getDate() - (daysAgo - 1 - i));
    const dateStr = day.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      revenue: map.get(dateStr) || 0,
    });
  }

  return result;
};

const predictRevenueNextWeek = async (req: any, res: any) => {
  try {
    const history = await getDailyRevenue(14); // 8 tuần gần nhất
    // Lọc ra các ngày có revenue thực sự
    const filtered = history.filter(item => item.revenue > 0);
    const revenueValues = filtered.map(item => item.revenue);
    //const revenueValues = [244000, 210000, 542000, 346000, 460000, 530000, 650000, 580000, 615000, 650000]
    console.log(revenueValues)
    if (revenueValues.length < 10) {
      return res.status(400).json({ message: "Không đủ dữ liệu để dự đoán." });
    }

    // Normalize
    const max = Math.max(...revenueValues);
    const min = Math.min(...revenueValues);
    const normalized = revenueValues.map(x => (x - min) / (max - min || 1));

    // Tạo tập huấn luyện
    const inputSize = 7;
    const xs = [], ys = [];

    for (let i = 0; i < normalized.length - inputSize; i++) {
      xs.push(normalized.slice(i, i + inputSize));
      ys.push(normalized[i + inputSize]);
    }

    const xsTensor = tf.tensor2d(xs, [xs.length, inputSize]);
    const ysTensor = tf.tensor1d(ys);

    // Mô hình
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape: [inputSize], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    // model.add(tf.layers.dense({ units: 1, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'softplus' }));

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    await model.fit(xsTensor, ysTensor, { epochs: 100, verbose: 0 });

    // Dự đoán
    let input = normalized.slice(-inputSize);
    const predictions: any[] = [];

    for (let i = 0; i < 7; i++) {
      const inputTensor = tf.tensor2d([input], [1, inputSize]);
      const output = model.predict(inputTensor) as tf.Tensor;
      const predicted = (await output.array()) as number[][];
      const denormalized = Math.max(0, predicted[0][0] * (max - min) + min);
      predictions.push({
        count: `Ngày ${i+1}`,
        data: Math.round(denormalized)
      });
      input = [...input.slice(1), predicted[0][0]];
    }

    res.status(200).json({
      message: "Dự đoán doanh thu 7 ngày tới thành công.",
      data: predictions,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//=================================================================//
const getDailyDishSales = async (daysAgo = 56) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysAgo);

  const rawData = await BillModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        isDeleted: false,
      },
    },
    { $unwind: "$dishItem" },
    {
      $group: {
        _id: {
          title: "$dishItem.title",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalCount: { $sum: "$dishItem.count" },
      },
    },
    {
      $group: {
        _id: "$_id.title",
        dailySales: {
          $push: {
            date: "$_id.date",
            count: "$totalCount",
          },
        },
      },
    },
  ]);

  return rawData;
};
//*************************************** sửa giảm số lượng promotion ******************************/
const predictTop5Dishes = async (req: any, res: any) => {
  try {
    const rawData: any = await getDailyDishSales(56);
    // console.log(JSON.stringify(rawData, null, 2));
    // const rawData = [
    //   {
    //     _id: "Món chính 1",
    //     dailySales: [
    //       { date: "2025-03-19", count: 3 },
    //       { date: "2025-03-22", count: 2 },
    //       { date: "2025-03-27", count: 5 },
    //       { date: "2025-04-01", count: 4 },
    //       { date: "2025-04-10", count: 3 },
    //       { date: "2025-04-18", count: 6 },
    //       { date: "2025-04-25", count: 2 },
    //       { date: "2025-05-05", count: 5 },
    //       { date: "2025-05-10", count: 7 }
    //     ]
    //   },
    //   {
    //     _id: "Đồ uống 1",
    //     dailySales: [
    //       { date: "2025-03-20", count: 1 },
    //       { date: "2025-03-23", count: 2 },
    //       { date: "2025-04-01", count: 2 },
    //       { date: "2025-04-08", count: 3 },
    //       { date: "2025-04-18", count: 2 },
    //       { date: "2025-04-28", count: 3 },
    //       { date: "2025-05-11", count: 4 }
    //     ]
    //   },
    //   {
    //     _id: "Hamburger gà chiên",
    //     dailySales: [
    //       { date: "2025-03-21", count: 3 },
    //       { date: "2025-03-28", count: 2 },
    //       { date: "2025-04-10", count: 3 },
    //       { date: "2025-04-19", count: 2 },
    //       { date: "2025-04-26", count: 2 },
    //       { date: "2025-05-03", count: 3 },
    //       { date: "2025-05-12", count: 5 }
    //     ]
    //   },
    //   {
    //     _id: "Thịt viên chiên",
    //     dailySales: [
    //       { date: "2025-03-19", count: 2 },
    //       { date: "2025-03-26", count: 2 },
    //       { date: "2025-04-05", count: 1 },
    //       { date: "2025-04-12", count: 3 },
    //       { date: "2025-04-19", count: 2 },
    //       { date: "2025-04-26", count: 1 },
    //       { date: "2025-05-10", count: 2 }
    //     ]
    //   },
    //   {
    //     _id: "Món khai vị 1",
    //     dailySales: [
    //       { date: "2025-03-21", count: 1 },
    //       { date: "2025-03-28", count: 2 },
    //       { date: "2025-04-04", count: 2 },
    //       { date: "2025-04-11", count: 1 },
    //       { date: "2025-04-18", count: 3 },
    //       { date: "2025-04-25", count: 2 },
    //       { date: "2025-05-02", count: 1 },
    //       { date: "2025-05-09", count: 4 }
    //     ]
    //   }
    // ];

    const inputSize = 3;
    const predictionDays = 7;
    const dishPredictions: { title: string, totalPredicted: number }[] = [];

    for (const dish of rawData) {
      const sortedSales = dish.dailySales.sort((a: any, b: any) => a.date.localeCompare(b.date));
      const allDays = sortedSales.map((d: any) => d.count);

      // Chỉ dự đoán khi có đủ số lượng mẫu cần thiết
      if (allDays.length < inputSize + 1) continue;

      const max = Math.max(...allDays);
      const min = Math.min(...allDays);
      if (max === min) continue;

      const normalized = allDays.map((x: any) => (x - min) / (max - min));
      const xs = [], ys = [];

      for (let i = 0; i < normalized.length - inputSize; i++) {
        xs.push(normalized.slice(i, i + inputSize));
        ys.push(normalized[i + inputSize]);
      }

      const xsTensor = tf.tensor2d(xs, [xs.length, inputSize]);
      const ysTensor = tf.tensor1d(ys);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 16, inputShape: [inputSize], activation: 'relu' }));
      model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1 }));

      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
      await model.fit(xsTensor, ysTensor, { epochs: 100, verbose: 0 });

      let input = normalized.slice(-inputSize);
      const realInput = [...input];
      let total = 0;

      for (let i = 0; i < predictionDays; i++) {
        const inputTensor = tf.tensor2d([realInput], [1, inputSize]);
        const output = model.predict(inputTensor) as tf.Tensor;
        const predArray = await output.array() as number[][];
        const predicted = predArray[0][0];
        const denormalized = predicted * (max - min) + min;
        total += denormalized;
        }

      dishPredictions.push({
        title: dish._id,
        totalPredicted: Math.round(total),
      });

      console.log(`Dự đoán món ${dish._id}: ${Math.round(total)}`);
    }

    dishPredictions.sort((a, b) => b.totalPredicted - a.totalPredicted);

    res.status(200).json({
      message: "Dự đoán 5 món bán chạy nhất tuần tới",
      data: dishPredictions.slice(0, 5),
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export {getTimeBill, predictRevenueNextWeek, predictTop5Dishes}