import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FrontPage from './components/front-page/front-page'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FrontPage />
  </StrictMode>,
)
