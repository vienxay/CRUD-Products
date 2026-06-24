import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

router.use(authenticateToken);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
