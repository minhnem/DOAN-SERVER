"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRules) => {
    return (req, res, next) => {
        const userRule = req.rule;
        //console.log(req.rule)
        if (!allowedRules.includes(userRule)) {
            return res.status(403).json({
                error: "Bạn không có quyền truy cập chức năng này"
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map