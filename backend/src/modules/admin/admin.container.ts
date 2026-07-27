import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository)

export {adminService}