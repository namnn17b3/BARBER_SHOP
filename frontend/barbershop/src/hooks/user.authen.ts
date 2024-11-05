import { AuthenContext } from "@/authen/Context";
import { useContext } from "react";

export function useAuthen() {
  const { state, dispatch } = useContext(AuthenContext);

  return {
    authenState: state,
    authenDispatch: dispatch,
  };
}
