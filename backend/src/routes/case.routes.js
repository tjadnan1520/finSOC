const { Router } = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validator');
const caseController = require('../controllers/case.controller');
const { assignCaseValidation, addNoteValidation, resolveCaseValidation } = require('../validators/case.validator');

const router = Router();

router.use(auth);

router.get('/', caseController.getCases);
router.get('/summary', caseController.getCaseSummary);
router.get('/:id', caseController.getCase);
router.patch('/assign', authorize('OPERATOR', 'MANAGEMENT'), assignCaseValidation, validate, caseController.assignCase);
router.patch('/:id/accept', authorize('OPERATOR'), caseController.acceptCase);
router.patch('/:id/resolve', authorize('OPERATOR', 'MANAGEMENT'), caseController.resolveCase);
router.patch('/:id/close', authorize('OPERATOR', 'MANAGEMENT'), caseController.closeCase);
router.post('/:id/notes', authorize('OPERATOR'), addNoteValidation, validate, caseController.addNote);

module.exports = router;
