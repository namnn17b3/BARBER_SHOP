'use client';

import { AuthenContext } from "@/authen/Context";
import { useReducer } from "react";

const initialState = null;

export const authenReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
    case "ME":
    case "UPDATE_PROFILE":
      return action.payload;
    case "LOGOUT":
      return action.payload;
    default:
      return state;
  }
};

export const AuthenrProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authenReducer, initialState);

  return (
    <AuthenContext.Provider value={{ state, dispatch }}>
      { children }
    </AuthenContext.Provider>
  );
};
