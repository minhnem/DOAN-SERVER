"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./src/routers/userRouter"));
const dishRouter_1 = __importDefault(require("./src/routers/dishRouter"));
const supplierRouter_1 = __importDefault(require("./src/routers/supplierRouter"));
const promotionRouter_1 = __importDefault(require("./src/routers/promotionRouter"));
const materialsRouter_1 = __importDefault(require("./src/routers/materialsRouter"));
const tableRouter_1 = __importDefault(require("./src/routers/tableRouter"));
const reservationsRouter_1 = __importDefault(require("./src/routers/reservationsRouter"));
const orderRouter_1 = __importDefault(require("./src/routers/orderRouter"));
const billRouter_1 = __importDefault(require("./src/routers/billRouter"));
const feedbackRouter_1 = __importDefault(require("./src/routers/feedbackRouter"));
const reportRouter_1 = __importDefault(require("./src/routers/reportRouter"));
const personnelRouter_1 = __importDefault(require("./src/routers/personnelRouter"));
const attendanceRouter_1 = __importDefault(require("./src/routers/attendanceRouter"));
const dashboardRouter_1 = __importDefault(require("./src/routers/dashboardRouter"));
const subcsribeRouter_1 = __importDefault(require("./src/routers/subcsribeRouter"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const dbURL = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.ywhsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // hoặc domain FE đang chạy
    }
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.set('io', io);
app.use('/user', userRouter_1.default);
app.use('/dish', dishRouter_1.default);
app.use('/supplier', supplierRouter_1.default);
app.use('/promotion', promotionRouter_1.default);
app.use('/materials', materialsRouter_1.default);
app.use('/table', tableRouter_1.default);
app.use('/reservations', reservationsRouter_1.default);
app.use('/order', orderRouter_1.default);
app.use('/bill', billRouter_1.default);
app.use('/feedback', feedbackRouter_1.default);
app.use('/report', reportRouter_1.default);
app.use('/personnel', personnelRouter_1.default);
app.use('/attendance', attendanceRouter_1.default);
app.use('/dashboard', dashboardRouter_1.default);
app.use('/subscribe', subcsribeRouter_1.default);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(dbURL);
        console.log('connect to db successfully');
    }
    catch (error) {
        console.log(`can not connect to db ${error}`);
    }
});
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnectedd:', socket.id);
    });
});
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});
// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`server is starting at http://localhost:${PORT}`)
//     })
// }).catch((error) => {
//     console.log(error)
// })
//# sourceMappingURL=index.js.map