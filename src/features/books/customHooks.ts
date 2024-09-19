import { useCallback } from "react";
import { useNavigate } from "react-router-dom"

export function useNavigateWithQuery() {
  const navigate = useNavigate();
  const navi = useCallback((path:string) => {
    navigate(path + window.location.search);
  }, [ navigate ]);

  return navi;
}