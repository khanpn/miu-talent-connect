import React, { FC, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoading from './components/common/PageLoading/PageLoading';
import { useAxiosInterceptors } from './rest/restClient';

const HomePage = lazy(() => import('./components/pages/HomePage/HomePage'));
const CandidateProfilePage = lazy(
  () => import('./components/pages/CandidateProfilePage/CandidateProfilePage')
);
const LoginPage = lazy(() => import('./components/pages/LoginPage/LoginPage'));
const SignUpPage = lazy(
  () => import('./components/pages/SignUpPage/SignUpPage')
);
const ChangePasswordPage = lazy(
  () => import('./components/pages/ChangePasswordPage/ChangePasswordPage')
);
const ResetPasswordPage = lazy(
  () => import('./components/pages/ResetPasswordPage/ResetPasswordPage')
);
const ResetPasswordTokenRequestPage = lazy(
  () =>
    import(
      './components/pages/ResetPasswordTokenRequestPage/ResetPasswordTokenRequestPage'
    )
);
const CandidateProfileWizardPage = lazy(
  () =>
    import(
      './components/pages/CandidateProfileWizardPage/CandidateProfileWizardPage'
    )
);
const CandidateManagementPage = lazy(
  () =>
    import('./components/pages/CandidateManagementPage/CandidateManagementPage')
);
const EmployerManagementPage = lazy(
  () =>
    import('./components/pages/EmployerManagementPage/EmployerManagementPage')
);
const AdministratorManagementPage = lazy(
  () =>
    import(
      './components/pages/AdministratorManagementPage/AdministratorManagementPage'
    )
);
const CategoryManagementPage = lazy(
  () =>
    import('./components/pages/CategoryManagementPage/CategoryManagementPage')
);
const SearchDataManagementPage = lazy(
  () =>
    import(
      './components/pages/SearchDataManagementPage/SearchDataManagementPage'
    )
);

interface RouteConfig {
  path: string;
  Component: React.ComponentType;
}

const routes: RouteConfig[] = [
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignUpPage },
  { path: '/change-password', Component: ChangePasswordPage },
  {
    path: '/reset-password-token-request',
    Component: ResetPasswordTokenRequestPage,
  },
  { path: '/reset-password', Component: ResetPasswordPage },
  { path: '/candidate-profile/:userId', Component: CandidateProfilePage },
  {
    path: '/candidate-profile-wizard/:userId',
    Component: CandidateProfileWizardPage,
  },
  {
    path: '/candidate-management',
    Component: CandidateManagementPage,
  },
  {
    path: '/employer-management',
    Component: EmployerManagementPage,
  },
  {
    path: '/administrator-management',
    Component: AdministratorManagementPage,
  },
  {
    path: '/category-management',
    Component: CategoryManagementPage,
  },
  {
    path: '/search-data-management',
    Component: SearchDataManagementPage,
  },
];

const PageRouter: FC = () => {
  useAxiosInterceptors();
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default PageRouter;
