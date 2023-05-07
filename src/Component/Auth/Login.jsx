import axios from "axios";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { setAuthorized, setLoginInfo } from "../../store/authSlice";
import { useEffect } from "react";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: true,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Chưa nhập username/email"),
      password: Yup.string().required("Chưa nhập mật khẩu"),
    }),
    onSubmit: (data) => {
      axios({
        method: "POST",
        url: "http://localhost:8070/auth/signin",
        data: data,
      })
        .then(function (res) {
          //console.log(res)
          dispatch(
            // sử dụng useSlice bằng đối tượng
            setLoginInfo({
              username: res.data.username,
              role: res.data.role,
              token: res.data.token,
            })
          );
          dispatch(setAuthorized(true));

          switch (res.data.role) {
            case "STUDENT":
              navigate("/student");
              break;
            case "ADMIN":
              navigate("/admin");
              break;
            case "LECTURER":
              navigate("/lecturer");
              break;
            default:
              break;
          }
        })
        .catch(function (error) {
          dispatch(setAuthorized(false));
          if (error.response) {
            // phản hồi được nhận
            if (error.response.data.message === "ACCOUNT HAS BEEN BLOCKED") {
              toast.error("Tài khoản đã bị khóa");
            } else if (error.response.data.message === "INVALID PASSWORD") {
              toast.error("Sai mật khấu");
            } else if (
              error.response.data.message === "INVALID USERNAME OR EMAIL"
            ) {
              toast.error("Sai username/email");
            } else {
              toast.error("Lỗi! Vui lòng đăng nhập lại sau");
            }
          } else if (error.request) {
            // không nhận được phản hồi
            toast.error("Không thể kết nối đến server");
          } else {
            // lỗi khác
            toast.error("Lỗi! Vui lòng đăng nhập lại sau");
          }
        });
    },
  });
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);
  return (
    <div className="flex justify-center h-screen min-w-min">
      <div className="w-full mt-20 sm:w-1/2 lg:w-1/3">
        <Card>
          <Label className="text-xl text-center">Đăng nhập</Label>
          <form
            className="flex flex-col gap-4 justify-center align-middle"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username/Email" />
              </div>
              <TextInput
                id="username"
                type="text"
                required={true}
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              {formik.errors.username && (
                <p
                  style={{ textAlign: "left", color:"red" }}
                  className="text-danger text-left"
                >
                  {formik.errors.username}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                required={true}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && (
                <p
                  style={{ textAlign: "left", color:"red" }}
                  className="text-danger text-left"
                >
                  {formik.errors.password}
                </p>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}

export default Login;
