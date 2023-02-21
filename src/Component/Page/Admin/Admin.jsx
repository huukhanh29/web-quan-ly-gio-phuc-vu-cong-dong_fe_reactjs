
import jwt_decode from "jwt-decode";
import { useStore } from "react-redux";
export default function Admin() {
  const store = useStore();
  const token = store.getState().auth.token;
  const decoded = jwt_decode(token);
  const role = decoded.role[0].authority
  return (
    <>
      {role === "ADMIN" ? (
        <div className="mt-5">
          <h3 className="pt-5">hello admin</h3>
        </div>
      ) : (
        "You can't access this page!"
      )}
    </>
  );
}
