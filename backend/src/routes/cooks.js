const router = require('express').Router();
const { getAll, getOne, update, remove } = require('../controllers/cookController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getOne);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

module.exports = router;
