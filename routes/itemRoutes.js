const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../utils/imageUpload');

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authMiddleware, upload.single('image'), createItem);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'user']), upload.single('image'), updateItem);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'user']), deleteItem);

module.exports = router;
