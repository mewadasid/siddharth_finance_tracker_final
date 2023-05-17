import { useEffect } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Protected({ Cmp, ispublic }) {
  const cookie = new Cookies();
  const token = cookie.get("token");

  const navigate = useNavigate();
  useEffect(() => {
    if (ispublic === true) {
      if (!token) {
        return Cmp;
      } else {
        navigate("/");
      }
    } else {
      if (!token) {
        return navigate("/login");
      }
    }
    //eslint-disable-next-line
  }, []);
  return Cmp;
}
