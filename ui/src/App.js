import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Success from './pages/success';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;