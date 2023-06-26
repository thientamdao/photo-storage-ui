import { BrowserRouter, Route, Routes } from 'react-router-dom'

import DefaultLayout from './views/layouts/DefaultLayout'

import LogIn from './views/pages/LogIn'
import SignUp from './views/pages/SignUp'
import Home from './views/pages/Home'
import Missing from './views/pages/Missing'

import './scss/styles.scss'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />
        <Route
          path="/shared-with-me"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />
        <Route path="*" element={<Missing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
