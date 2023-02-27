import axios from "axios";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setAuthorized, setLoginInfo } from "../../store/authSlice";
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
        .min(4, "Tên người dùng phải nhiều hơn 4 kí tự")
        .max(8, "Tên người dùng phải ít hơn 8 kí tự")
        .required("Không được để trống trường này"),
      password: Yup.string().required("Chưa nhập mật khẩu"),
    }),
    //   onSubmit: (data) => {
    //     // console.log(data);
    //     axios({
    //       method: "POST",
    //       url: "http://localhost:8070/auth/signin",
    //       data: data,
    //     })
    //       .then(function (res) {
    //         if (res.data.role === "USER") {
    //           dispatch(
    //             // sử dụng useSlice bằng đối tượng
    //             setLoginInfo({
    //               username: res.data.username,
    //               role: res.data.role,
    //               token: res.data.token,
    //             })
    //           );
    //           dispatch(
    //             setAuthorized(true)
    //           );
    //           navigate("/user");
    //           //console.log(res.data)
    //         } else
    //         if(res.data.role === "USER"){
    //           dispatch(
    //             // sử dụng useSlice bằng đối tượng
    //             setLoginInfo({
    //               username: res.data.username,
    //               role: res.data.role,
    //               token: res.data.token,
    //             })
    //           );
    //           dispatch(
    //             setAuthorized(true)
    //           )
    //           navigate("/admin");
    //         }
    //         else{
    //           dispatch(
    //             // sử dụng useSlice bằng đối tượng
    //             setLoginInfo({
    //               username: res.data.username,
    //               role: res.data.role,
    //               token: res.data.token,
    //             })
    //           );
    //           dispatch(
    //             setAuthorized(true)
    //           )
    //           navigate("/lecturer");
    //         }
    //       })
    //       .catch(function (res) {
    //         dispatch(
    //           setAuthorized(false)
    //         )
    //         console.log(res);
    //       });
    //   },
    onSubmit: (data) => {
      axios({
        method: "POST",
        url: "http://localhost:8070/auth/signin",
        data: data,
      })
        .then(function (res) {
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
        .catch(function (res) {
          dispatch(setAuthorized(false));
          console.log(res);
        });
    },
  });

  return (
    <div className="flex justify-center h-screen min-w-min">
      <div className="w-full mt-20 sm:w-1/2 lg:w-1/3">
        <Card>
          <form
            className="flex flex-col gap-4 justify-center align-middle"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Your username" />
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                required={true}
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              {formik.errors.username && (
                <p
                  style={{ textAlign: "left" }}
                  className="text-danger text-left"
                >
                  {formik.errors.username}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
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
                  style={{ textAlign: "left" }}
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
    </div>
  );
}

export default Login;
