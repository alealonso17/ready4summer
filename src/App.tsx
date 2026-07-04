import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Layout from './pages/layout'
import Hoy from './pages/Hoy'
import Registro from './pages/Registro'


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route path='/home' element={<Home />} />
          <Route path='/hoy' element={<Hoy />} />
          <Route path='/registro' element={<Registro />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
