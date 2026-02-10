
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Dashboard from '../pages/dashboard';
import TransferMoney from '../pages/transferMoney';
import History from '../pages/history';

const AppRoutes = () => {
    return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transferMoney" element={<TransferMoney />} />
        <Route path="/history" element={<History />} />
    </Routes>
    )
}
export default AppRoutes;