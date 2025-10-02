import { Router } from "express";
import { SearchController } from "../controllers/SearchController";
import { validateQuery } from "../middleware/validation";
import { searchSchema } from "../validation/property";

const router = Router();
const searchController = new SearchController();

router.get("/", validateQuery(searchSchema), searchController.searchProperties);
router.get("/locations", searchController.getLocations);
router.get("/types", searchController.getPropertyTypes);

export default router;
