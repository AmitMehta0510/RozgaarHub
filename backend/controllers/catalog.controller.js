import Catalog from "../models/catalog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCatalogItems = asyncHandler(async (req, res) => {
  const items = await Catalog.find();
  res.json({ success: true, items });
});

export const addCatalogItem = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const item = await Catalog.create({ name, description, price });
  res.status(201).json({ success: true, item });
});

export const deleteCatalogItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Catalog.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  res.json({ success: true, message: "Item deleted" });
});
