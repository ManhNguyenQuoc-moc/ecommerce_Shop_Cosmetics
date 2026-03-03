import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
// import { AuthProvider } from './stores/AuthContext';
import { useMessageInit } from "./utils/message";
function App() {
  useMessageInit();
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
      <AppRoutes />
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}

export default App;