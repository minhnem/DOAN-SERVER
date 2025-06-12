import ReservationsModel from "../models/ReservationsModel"
import TableModel from "../models/TableModel"
import { handleSendEmail } from "../utils/handleSendEmail"

const addNewReservations = async (req: any, res: any) => {
    const body = req.body
    try {
        const reservations = new ReservationsModel(body)
        const item = await reservations.save()
        if(item) {
            await TableModel.findByIdAndUpdate(item.table_id, {$set: {status: 'Được đặt trước'}})
        }

        if(item.status === 'Chờ xử lý') {
            await handleSendEmail({
                from: 'Nhà hàng Hải Dương',
                to: 'namtdvp10a6@gmail.com',
                subject: "📥 Đơn đặt bàn mới từ khách hàng",
                text: `Khách hàng ${item.name} vừa đặt bàn.`,
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f0f0;">
                    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                      <h2 style="color: #2b6cb0;">📥 Đơn đặt bàn mới</h2>
                      <p>Khách hàng <strong>${item.name}</strong> vừa gửi yêu cầu đặt bàn. Vui lòng kiểm tra và xác nhận sớm nhất.</p>
              
                      <h3>📄 Thông tin chi tiết:</h3>
                      <ul style="line-height: 1.6;">
                        <li><strong>Tên khách hàng:</strong> ${item.name}</li>
                        <li><strong>Số điện thoại:</strong> ${item.phone || 'Chưa có'}</li>
                        <li><strong>Email:</strong> ${item.email}</li>
                        ${reservations.reservation_date ? `<li><strong>Ngày:</strong> ${reservations.reservation_date}</li>` : ''}
                        ${reservations.reservation_time ? `<li><strong>Thời gian:</strong> ${reservations.reservation_time}</li>` : ''}
                      </ul>
              
                      <p style="margin-top: 20px;">Vui lòng kiểm tra hệ thống để xử lý đơn này.</p>
              
                      <p style="margin-top: 30px;">Trân trọng,</p>
                      <p><strong>Hệ thống đặt bàn - Nhà hàng Hải Dương</strong></p>
                    </div>
                  </div>
                `,
            });
            const io = req.app.get('io');
            io.emit('new-reservation', item);
        }

        res.status(200).json({
            message: 'Thêm 1 thông tin đặt bàn thành công.',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getReservationsById = async (req: any, res: any) => {
    const id = req.query
    try {
        const reservations = await ReservationsModel.findById(id)
        res.status(200).json({
            message: 'Lấy đơn đặt bàn theo id thành công',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllReservations = async (req: any, res: any) => {
    try {
        const reservations = await ReservationsModel.find({})
        res.status(200).json({
            message: 'Thành công',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllReservationsStatus = async (req: any, res: any) => {
    const query = req.query
    const {status} = query
    try {
        const reservations = await ReservationsModel.find({status: status}).sort({ createdAt: -1 })
        res.status(200).json({
            message: 'Thành công',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removeReservations = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const item = await ReservationsModel.findByIdAndDelete(id)
        item && await TableModel.findOneAndUpdate({_id: item?.table_id}, {$set: {status: 'Trống'}})
        res.status(200).json({
            message: 'Xóa thông tin đặt bàn thành công.',
            data: {}
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateReservations = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const table = await TableModel.findById(body.table_id)
        if(body.status === 'Từ chối') {
            await handleSendEmail({
                from: 'Nhà hàng Hải Dương',
                to: body.email,
                subject: "Rất tiếc! Đặt bàn của bạn không thể được xác nhận",
                text: `Rất tiếc! Nhà hàng Hải Dương không thể xác nhận đặt bàn của bạn vào thời điểm này.`,
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                      <h2 style="color: #e53e3e;">❌ Rất tiếc!</h2>
                      <p>Xin chào <strong>${body.name || 'Quý khách'}</strong>,</p>
                      <p>Chúng tôi rất tiếc phải thông báo rằng <strong>yêu cầu đặt bàn của bạn tại Nhà hàng Hải Dương</strong> không thể được xác nhận vào thời điểm này.</p>

                      <p>Lý do có thể do thời điểm bạn chọn đã hết chỗ hoặc có sự thay đổi trong lịch phục vụ của nhà hàng.</p>
              
                      <p>Chúng tôi rất mong được đón tiếp bạn vào dịp khác. Vui lòng liên hệ hotline bên dưới để được hỗ trợ đặt bàn sớm nhất!</p>
              
                      <p style="margin-top: 30px;">Trân trọng,</p>
                      <p><strong>Nhà hàng Hải Dương</strong></p>
                      <p>📞 Hotline: 0123 456 789</p>
                    </div>
                  </div>
                `,
            });  
            const io = req.app.get('io');
            io.emit('new-reservation', 0);
        }
        
        if (body.status === 'Đã xác nhận' && table) {
            await handleSendEmail({
                from: 'Nhà hàng Hải Dương' ,
                to: body.email,
                subject: 'Xác nhận đặt bàn tại Nhà hàng Hải Dương',
                text:  `Cảm ơn bạn đã đặt bàn tại Nhà hàng Hải Dương. Mã xác nhận của bạn là: ${body.table_id}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2f855a;">🍽️ Nhà hàng Hải Dương</h2>
                        <p>Xin chào <strong>${body.name|| 'Quý khách'}</strong>,</p>
                        <p>Cảm ơn bạn đã đặt bàn tại <strong>Nhà hàng Hải Dương</strong>. Chúng tôi rất hân hạnh được phục vụ bạn!</p>
    
                        <h3>Thông tin đặt bàn:</h3>
                        <ul style="line-height: 1.6;">
                        <li><strong>Mã bàn:</strong> ${body.table_id}</li>
                        <li><strong>Tên bàn:</strong> ${table.name}</li>
                        <li><strong>Email:</strong> ${body.email}</li>
                        <!-- Thêm thông tin thời gian nếu có -->
                        ${body.reservation_date ? `<li><strong>Ngày:</strong> ${body.reservation_date}</li>` : ''}
                        ${body.reservation_time ? `<li><strong>Thời gian:</strong> ${body.reservation_time}</li>` : ''}
                        </ul>
    
                        <p>Nếu có bất kỳ thay đổi nào, vui lòng liên hệ với chúng tôi sớm nhất.</p>
    
                        <p style="margin-top: 30px;">Trân trọng,</p>
                        <p><strong>Nhà hàng Hải Dương</strong></p>
                        <p>📞 Hotline: 0123 456 789</p>
                    </div>
                    </div>
                `,
            })
            const io = req.app.get('io');
            io.emit('new-reservation', 0);
        }
        const reservations = await ReservationsModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Cập nhật thông tin đặt bàn thành công.',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {addNewReservations, getAllReservations, updateReservations, removeReservations, getReservationsById, getAllReservationsStatus}