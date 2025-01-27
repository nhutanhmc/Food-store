import {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
  } from "../../../services/storeService";
  
  export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
  
    try {
      switch (method) {
        case "GET":
          if (id) {
            const store = await getStoreById(id);
            if (store) {
              res.status(200).json(store);
            } else {
              res.status(404).json({ message: "Store not found" });
            }
          } else {
            const stores = await getAllStores();
            res.status(200).json(stores);
          }
          break;
  
        case "POST":
          if (!req.body.name || !req.body.priceType || !req.body.address || !req.body.image) {
            return res.status(400).json({
              message: "Name, priceType, address, and image are required",
            });
          }
          const createdStore = await createStore(req.body);
          res.status(201).json(createdStore);
          break;
  
        case "PUT":
          if (!id) {
            return res.status(400).json({ message: "Store ID is required for update" });
          }
          const updatedStore = await updateStore(id, req.body);
          res.status(200).json(updatedStore);
          break;
  
        case "DELETE":
          if (!id) {
            return res.status(400).json({ message: "Store ID is required for deletion" });
          }
          await deleteStore(id);
          res.status(204).end();
          break;
  
        default:
          res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  