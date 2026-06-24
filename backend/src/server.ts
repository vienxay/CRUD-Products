import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
