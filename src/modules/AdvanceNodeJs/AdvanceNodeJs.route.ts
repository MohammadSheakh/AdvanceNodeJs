import express from 'express';
import * as validation from './AdvanceNodeJs.validation';
import { AdvanceNodeJsController } from './AdvanceNodeJs.controller';
import { IAdvanceNodeJs } from './AdvanceNodeJs.interface';
import { validateFiltersForQuery } from '../../middlewares/queryValidation/paginationQueryValidationMiddleware';
import validateRequest from '../../shared/validateRequest';
import auth from '../../middlewares/auth';

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

export const optionValidationChecking = <T extends keyof IAdvanceNodeJs>(
  filters: T[]
) => {
  return filters;
};

// const taskService = new TaskService();
const controller = new AdvanceNodeJsController();

//info : pagination route must be before the route with params
router.route('/paginate').get(
  //auth('common'),
  validateFiltersForQuery(optionValidationChecking(['_id'])),
  controller.getAllWithPagination
);

////////////
//[🚧][🧑‍💻✅][🧪] // 🆗
router.route('/blocking').get(
  //auth('common'),
  controller.blocking
);

router.route('/blocking_four_workers').get(
  //auth('common'),
  controller.blocking_four_workers
);

router.route('/non-blocking').get(
  //auth('common'),
  controller.nonBlocking
);

router.route('/:id').get(
  // auth('common'),
  controller.getById
);

router.route('/update/:id').put(
  //auth('common'),
  // validateRequest(UserValidation.createUserValidationSchema),
  controller.updateById
);

//[🚧][🧑‍💻✅][🧪] // 🆗
router.route('/').get(auth('commonAdmin'), controller.getAll);

//[🚧][🧑‍💻✅][🧪] // 🆗
router.route('/create').post(
  // [
  //   upload.fields([
  //     { name: 'attachments', maxCount: 15 }, // Allow up to 5 cover photos
  //   ]),
  // ],
  auth('common'),
  validateRequest(validation.createHelpMessageValidationSchema),
  controller.create
);

router.route('/delete/:id').delete(
  //auth('common'),
  controller.deleteById
); // FIXME : change to admin

router.route('/softDelete/:id').put(
  //auth('common'),
  controller.softDeleteById
);

export const AdvanceNodeJsRoute = router;
