
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Dashboard from '../pages/dashboard';
import TransferMoney from '../pages/transferMoney';

const AppRoutes = () => {
    return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transferMoney" element={<TransferMoney />} />
    </Routes>
    )
}
export default AppRoutes;