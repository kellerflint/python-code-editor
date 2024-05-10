import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Success from './pages/success';
import CodeEditor from './CodeEditor';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;