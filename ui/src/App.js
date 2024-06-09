import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CodeEditor from './CodeEditor';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;