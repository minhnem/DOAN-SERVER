"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscribe_1 = require("../controller/subscribe");
const router = (0, express_1.Router)();
router.post('/add-new', subscribe_1.addNewSubscribe);
exports.default = router;
//# sourceMappingURL=subcsribeRouter.js.map