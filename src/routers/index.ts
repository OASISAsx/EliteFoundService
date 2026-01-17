import userRouter from "./user.route";
import mailRouter from "./mail.route";
import uploadRouter from "./upload.route";
import thaiGeo from "./thaiGeo.route";
import informationRouter from "./information.route";

const routes = [
  { path: "/api", router: userRouter },
  { path: "/api", router: mailRouter },
  { path: "/api", router: informationRouter },
  { path: "/api/upload", router: uploadRouter },
  { path: "/api", router: thaiGeo },
];

export default routes;
