import { Router } from 'express';
import * as ItemController from '../controllers/item.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

// Authorized routes
router.use(authorized);

router.route('/')
  .post(ItemController.createItem)
  .get(ItemController.getListItems);

router.route('/:id')
  .get(ItemController.getItem)
  .patch(ItemController.updateItem)
  .delete(ItemController.deleteItem);

export default router; 