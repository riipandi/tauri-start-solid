import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import RootLayout from '#/layouts/root-layout'

const Home = lazy(() => import('./views/home'))
const NotFound = lazy(() => import('./views/404'))

const AppRoutes = () => (
  <Router root={RootLayout}>
    <Route path="/" component={Home} />
    <Route path="*404" component={NotFound} />
  </Router>
)

export default AppRoutes
