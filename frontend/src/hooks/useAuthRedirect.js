import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthRedirect(condition, targetPath) {
  const navigate = useNavigate();

  useEffect(() => {
    if (condition) {
      navigate(targetPath);
    }
  }, [condition, navigate, targetPath]);
}