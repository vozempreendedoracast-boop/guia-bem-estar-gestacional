import { Navigate } from "react-router-dom";

// Plans page merged into Sales — redirect to /vendas#plans
const Plans = () => <Navigate to="/vendas#plans" replace />;

export default Plans;
