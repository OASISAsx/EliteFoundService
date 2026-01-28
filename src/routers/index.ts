import userRouter from "./user.route";
import mailRouter from "./mail.route";
import uploadRouter from "./upload.route";
import thaiGeo from "./thaiGeo.route";
import informationRouter from "./information.route";
import JobDetailRouter from "./jobDetail.route";
import BankInformationRouter from "./bankInfornation.route";
import loadContratRouter from "./loanContract.route";
import MainStatusRouter from "./mainStatus";

const routes = [
  { path: "/api", router: userRouter },
  { path: "/api", router: mailRouter },
  { path: "/api", router: informationRouter },
  { path: "/api/upload", router: uploadRouter },
  { path: "/api", router: thaiGeo },
  { path: "/api", router: JobDetailRouter },
  { path: "/api", router: BankInformationRouter },
  { path: "/api", router: loadContratRouter },
  { path: "/api", router: MainStatusRouter },
];

export default routes;
