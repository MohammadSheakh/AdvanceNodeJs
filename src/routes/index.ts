import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { LabRoute } from '../modules/lab/lab.route';
import { ConversationRoute } from '../modules/_chatting/conversation/conversation.route';
import { SubscriptionPlanRoute } from '../modules/_subscription/subscriptionPlan/subscriptionPlan.route';
import { AdvanceNodeJsRoute } from '../modules/AdvanceNodeJs/AdvanceNodeJs.route';

// import { ChatRoutes } from '../modules/chat/chat.routes';
// import { MessageRoutes } from '../modules/message/message.routes';
const router = express.Router();

const apiRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },

  ////////////////////// Created By Mohammad Sheakh

  {
    // 🌀
    path: '/lab',
    route: LabRoute,
  },
  {
    // 🌀
    path: '/conversation',
    route: ConversationRoute,
  },
  {
    // 🌀
    path: '/subscription',
    route: SubscriptionPlanRoute,
  },
  {
    // 🌀
    path: '/advance',
    route: AdvanceNodeJsRoute,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
