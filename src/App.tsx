import { createHashRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

// Hash router: GitHub Pages no tiene fallback SPA, así que las rutas van tras "#".
const router = createHashRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}
