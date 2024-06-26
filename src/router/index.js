import {route} from 'quasar/wrappers'
import {createMemoryHistory, createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import routes from './routes'
import apiEmitter, {API_ERROR_EVENTS} from "src/event/ApiErrorEventEmitter";
import {Notify} from "quasar";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

let router = null;

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  return router;
});

// 监听 未授权事件
apiEmitter.on(API_ERROR_EVENTS.UN_AUTH, (msg) => {
  Notify.create({
    message: '您需要登录以访问这个页面。',
    type: 'warning',
    position: 'top',
    timeout: 3000,
    actions: [{label: '前往登录', color: 'white', handler: () => router.push('/login')}]
  });
});

export {router};
