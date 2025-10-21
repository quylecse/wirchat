import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ChatAppPage from './pages/ChatAppPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />

        {/* private routes */}
        <Route path='/' element={<ChatAppPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
