import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavigateToLastRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastRoute = localStorage.getItem("last-admin-route") || "users-list";
    navigate(lastRoute, { replace: true });
  }, [navigate]);

  return null;
}
