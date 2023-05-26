import { Cookies } from "react-cookie";
import { Navigate } from "react-router-dom";

type ProtectedType = {
  ispublic: boolean;
  Cmp: any;
};
export default function Protected({ Cmp, ispublic }: ProtectedType) {
  const cookie = new Cookies();
  const token = cookie.get("token");

  if (ispublic === true) {
    if (!token) {
      return Cmp;
    } else {
      return <Navigate to={"/"} />;
    }
  } else {
    if (!token) {
      return <Navigate to={"/login"} />;
    } else {
      return Cmp;
    }
  }
}
