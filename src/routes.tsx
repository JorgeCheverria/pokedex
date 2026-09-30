import type { RouteObject } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Detail } from './pages/Detail'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

/** Rutas compartidas por la app (hash router) y los tests (memory router). */
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/pokemon/:id', element: <Detail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
