import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
  YOUR_FUTURE: 'your_future',
  VACANCY_CHOOSE: 'vacancy_choose',
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}`, []),
      createPanel(DEFAULT_VIEW_PANELS.YOUR_FUTURE, `/${DEFAULT_VIEW_PANELS.YOUR_FUTURE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.VACANCY_CHOOSE, `/${DEFAULT_VIEW_PANELS.VACANCY_CHOOSE}`, []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
