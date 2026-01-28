"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("./user.route"));
const mail_route_1 = __importDefault(require("./mail.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const thaiGeo_route_1 = __importDefault(require("./thaiGeo.route"));
const information_route_1 = __importDefault(require("./information.route"));
const jobDetail_route_1 = __importDefault(require("./jobDetail.route"));
const bankInfornation_route_1 = __importDefault(require("./bankInfornation.route"));
const loanContract_route_1 = __importDefault(require("./loanContract.route"));
const mainStatus_1 = __importDefault(require("./mainStatus"));
const routes = [
    { path: "/api", router: user_route_1.default },
    { path: "/api", router: mail_route_1.default },
    { path: "/api", router: information_route_1.default },
    { path: "/api/upload", router: upload_route_1.default },
    { path: "/api", router: thaiGeo_route_1.default },
    { path: "/api", router: jobDetail_route_1.default },
    { path: "/api", router: bankInfornation_route_1.default },
    { path: "/api", router: loanContract_route_1.default },
    { path: "/api", router: mainStatus_1.default },
];
exports.default = routes;
