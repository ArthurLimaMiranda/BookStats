'use client'
import{
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import { TelaPrincipal } from "./pages/tela-principal"

const router = createBrowserRouter([
  {
    path: '/',
    element: <TelaPrincipal/>
  },
])

export function App() {
  return <RouterProvider router={router}/>
}
