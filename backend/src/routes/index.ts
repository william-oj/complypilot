import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { requireOrgContext } from "../middleware/orgContext";
import { authorize } from "../middleware/authorize";
import { register, login, oauthLogin } from "../controllers/authController";
import { createOrganization, listOrganizations } from "../controllers/organizationController";
import { listAssets, createAsset, updateAsset, deleteAsset } from "../controllers/assetController";
import { listRisks, createRisk, updateRisk, createTreatment } from "../controllers/riskController";
import { listControls, updateControl } from "../controllers/controlController";
import { listPolicies, listPolicyTemplates, generatePolicy, updatePolicy } from "../controllers/policyController";
import { uploadEvidence, listEvidence } from "../controllers/evidenceController";
import { listAudits, createAudit, addFinding, addCorrectiveAction, updateAudit, mockAudit } from "../controllers/auditController";
import { dashboard } from "../controllers/dashboardController";
import { assist } from "../controllers/aiController";
import { getJourney } from "../controllers/journeyController";
import { searchAll } from "../controllers/searchController";
import { listBadges } from "../controllers/badgeController";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const router = Router();

const handle =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next);

router.post("/auth/register", handle(register));
router.post("/auth/login", handle(login));
router.post("/auth/oauth", handle(oauthLogin));

router.use(authenticate);

router.get("/organizations", handle(listOrganizations));
router.post("/organizations", handle(createOrganization));

router.use(requireOrgContext);

router.get("/assets", authorize("asset:read"), handle(listAssets));
router.post("/assets", authorize("asset:write"), handle(createAsset));
router.put("/assets/:id", authorize("asset:write"), handle(updateAsset));
router.delete("/assets/:id", authorize("asset:write"), handle(deleteAsset));

router.get("/risks", authorize("risk:read"), handle(listRisks));
router.post("/risks", authorize("risk:write"), handle(createRisk));
router.put("/risks/:id", authorize("risk:write"), handle(updateRisk));
router.post("/risks/:id/treatments", authorize("risk:write"), handle(createTreatment));

router.get("/controls", authorize("control:read"), handle(listControls));
router.put("/controls/:id", authorize("control:write"), handle(updateControl));

router.get("/policies/templates", authorize("policy:read"), handle(listPolicyTemplates));
router.get("/policies", authorize("policy:read"), handle(listPolicies));
router.post("/policies/generate", authorize("policy:write"), handle(generatePolicy));
router.put("/policies/:id", authorize("policy:write"), handle(updatePolicy));

router.get("/evidence", authorize("evidence:read"), handle(listEvidence));
router.post("/evidence", authorize("evidence:write"), upload.single("file"), handle(uploadEvidence));

router.get("/audits", authorize("audit:read"), handle(listAudits));
router.post("/audits", authorize("audit:write"), handle(createAudit));
router.put("/audits/:id", authorize("audit:write"), handle(updateAudit));
router.post("/audits/:id/findings", authorize("audit:write"), handle(addFinding));
router.post("/findings/:id/actions", authorize("audit:write"), handle(addCorrectiveAction));
router.get("/audits/mock", authorize("audit:read"), handle(mockAudit));

router.get("/dashboard", authorize("org:read"), handle(dashboard));
router.get("/journey", authorize("org:read"), handle(getJourney));
router.get("/badges", authorize("org:read"), handle(listBadges));

router.get("/search", authorize("org:read"), handle(searchAll));

router.post("/ai/assist", authorize("org:read"), handle(assist));
