import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Body } from './components'
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
              
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
