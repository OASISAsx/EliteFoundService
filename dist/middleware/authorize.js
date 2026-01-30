"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (roles = []) => (req, res, next) => {
    if (!req.auth) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // 👇 บอก TS ว่าจุดนี้ auth มีค่าแน่นอน
    const auth = req.auth;
    if (roles.length === 0) {
        return next();
    }
    const userRoles = auth.roles.map((r) => r.toLowerCase());
    const requiredRoles = roles.map((r) => r.toLowerCase());
    const hasRole = userRoles.some((role) => requiredRoles.includes(role));
    if (!hasRole) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
exports.authorize = authorize;
