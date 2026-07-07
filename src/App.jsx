import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Body, Dashboard, Login, MyAttendance, MyLeaves } from './components'
import { Provider } from 'react-redux'
import store from './utils/appStrore' ;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path='/' element={<Body />}>
              <Route path='/login' element={<Login />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path="/attendance" element={<MyAttendance />} />
              <Route path="/attendance" element={<MyAttendance />} />
              <Route path="/leaves" element={<MyLeaves />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
