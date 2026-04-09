const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/ingredientController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getOne);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

module.exports = router;
