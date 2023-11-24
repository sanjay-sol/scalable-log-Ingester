import { Request, Response } from "express";
import { Router } from "express";
import {
  getLevelSearch,
  getLogs,
  getfullSearch,
  saveLogs,
  getMessageSearch,
  getParentResourceId,
  unifiedSearch,
} from "../controller/logs.controller";
const router = Router();

function debug(req: Request, res: Response) {
  switch (req.method) {
    case "GET":
      console.log(req.query);
      res.send(req.query);
      break;
    case "POST":
      res.send(req.body);
      break;
    default:
      res.send();
      break;
  }
}

/* ---------------------------------- POST ---------------------------------- */
router.post("/logs", saveLogs);

/* ---------------------------------- GET ----------------------------------- */
router.get("/logs", getLogs);

// ? FULL TEXT SEARCH
router.get("/logs/search/:query", getfullSearch);

// ? LEVEL SEARCH AND SIZE DEFAULT IS 10
router.get("/logs/level/:levelid/:size", getLevelSearch);

// ? MESSAGE USE MATCH
router.get("/logs/message/:messageinfo", getMessageSearch);

// ? UNIFIED SEARCH FOR TRACEID, SPANID, TIMESTAMP, COMMIT
router.get("/logs/unisearch", unifiedSearch);

// ? METADATA
router.get("/logs/unisearch/metadata/:resourceId", getParentResourceId);

const apiRoutes = router;
export default apiRoutes;

