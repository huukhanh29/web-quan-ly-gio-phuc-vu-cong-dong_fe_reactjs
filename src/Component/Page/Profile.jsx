import { useDispatch, useStore } from "react-redux";
import jwt_decode from "jwt-decode";
import { Avatar, Spinner } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { setAvatar, setToken } from "../../store/authSlice";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "react-image-crop/dist/ReactCrop.css";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import "./Cropper.css";
export default function Profile() {
  const token = useStore().getState().auth.token;
  const decoded = jwt_decode(token);
  const id = decoded.id;
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      const { data, status } = await axios.get(`/user/get/${id}`);
      if (status === 200) {
        setUsers(data);
        dispatch(setAvatar(data.avatar));
        //console.log(data)
      }
    } catch (error) {
      if (error.response.status === 403) {
        dispatch(setToken(""));
      }
    }
  }, [dispatch, id]);
  useEffect(() => {
    document.title = "Hồ sơ";
    fetchData();
  }, [fetchData]);
  const baseUrl = "http://localhost:8070/";
  let cropper;
  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return; // không có file nào được chọn
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result;
      Swal.fire({
        title: "SweetAlert2 + cropperjs",
        html: `<div class="swal-container"> <img id="preview" src="${reader.result}"> </div> <img id="cropperjs" src="${reader.result}">`,
        didOpen: () => {
          const image = Swal.getPopup().querySelector("#cropperjs");
          cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
            crop: throttle(function () {
              const croppedCanvas = cropper.getCroppedCanvas();
              //xử lý lỗi querySelector("#preview") is null
              if(!Swal.getHtmlContainer()){
                return;
                }
                const preview = Swal.getHtmlContainer().querySelector("#preview");
              preview.src = croppedCanvas.toDataURL();
            }, 10),
          });
        },
        preConfirm: () => {
          const previewImage =
            Swal.getHtmlContainer().querySelector("#preview");
          const croppedCanvas = cropper.getCroppedCanvas();
          croppedCanvas.toBlob(
            (blob) => {
              const formData = new FormData();
              formData.append("file", blob, selectedFile.name);
              try {
                axios
                  .post(`/upload/${users.username}`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => {
                    //console.log(res);
                    fetchData();
                  });
              } catch (error) {
                console.log(error);
              }
            },
            "image/jpeg",
            0.8
          );
          return previewImage.src;
        },
      });
    };
  };
  
  const handleAvatarPreview = () => {
    Swal.fire({
      imageUrl: baseUrl + "files/" + users.avatar ?? "",
      imageWidth: 400,
      imageHeight: 400,
      imageAlt: "Avatar Preview",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      allowOutsideClick: true,
    });
  };
  function throttle(func, wait) {
    let timeout;

    return function () {
      const context = this;
      const args = arguments;

      const later = function () {
        timeout = null;
        func.apply(context, args);
      };

      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
  }

  const handleAvatarClick = () => {
    const fileInput = document.getElementById("avatar-input");
    fileInput.click();
  };

  return users === null ? (
    <Spinner color="failure" />
  ) : (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar
                className="shadow-md shadow-black rounded-full bg-cyan-300"
                alt="Default avatar with alt text"
                img={baseUrl + "files/" + users.avatar ?? ""}
                rounded={true}
                size="xl"
                bordered={true}
                color="pink"
                onClick={handleAvatarPreview}
              />

              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
              <FontAwesomeIcon
                onClick={handleAvatarClick}
                style={{ position: "absolute", bottom: 0, right: 0 }}
                icon={faEdit}
              />
            </div>
          </div>
        </div>
        {/* <input type="file" onChange={handleFileChange} />
        <button onClick={handleUploadAvatar}>Upload</button> */}
        <div className="mt-6">
          <div className="max-w-3xl mx-auto bg-white overflow-hidden shadow-md rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6 text-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                {users.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{users.role ?? ""}</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Hồ sơ
              </h2>
              {/* 3 cột: lg:grid-cols-3 */}
              <dl className="mt-1 max-w-2xl text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 ">
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">MSSV</dt>
                  <dd className="mt-1">{users.username}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="mt-1">{users.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">Điện thoại</dt>
                  <dd className="mt-1">{users.phone ?? ""}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">Ngày sinh</dt>
                  <dd className="mt-1">{users.date_of_birth ?? ""}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useDispatch, useStore } from "react-redux";
// import jwt_decode from "jwt-decode";
// import { Avatar, Spinner } from "flowbite-react";
// import { useCallback, useEffect, useState } from "react";
// import { setToken } from "../../store/authSlice";
// import axios from "axios";

// export default function Profile() {
// const token = useStore().getState().auth.token;
// const decoded = jwt_decode(token);
// const id = decoded.id;
// const dispatch = useDispatch()
// const [users, setUsers] = useState(null);
// const fetchData = useCallback(async () => {
//   try {
//     const { data, status } = await axios.get(`/user/get/${id}`);
//     if (status === 200) {
//       setUsers(data);
//       //console.log(data)
//     }
//   } catch (error) {
//     if (error.response.status === 403) {
//       dispatch(setToken(""));
//     }
//   }
// },[dispatch, id]);
// useEffect(() => {
//   document.title= "Hồ sơ"
//   fetchData()
// }, [fetchData]);
// const basUrl = "http://localhost:8070/";
// return users===null?<Spinner color="failure"/>: (
//   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="py-8">
//       <div className="flex items-center justify-center">
//         <div className="flex-shrink-0">
//           <div className="relative">
//             <Avatar
//               className="shadow-md shadow-black rounded-full bg-cyan-300"
//               alt="Default avatar with alt text"
//               img={basUrl + "image/" + users.avatar??""}
//               rounded={true}
//               size="xl"
//               bordered={true}
//               color="pink"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="mt-6">
//         <div className="max-w-3xl mx-auto bg-white overflow-hidden shadow-md rounded-lg divide-y divide-gray-200">
//           <div className="px-4 py-5 sm:px-6 text-center">
//             <h2 className="text-lg leading-6 font-medium text-gray-900">
//               {users.name}
//             </h2>
//             <p className="mt-1 text-sm text-gray-500">{users.role??""}</p>
//           </div>
//           <div className="px-4 py-5 sm:p-6">
//             <h2 className="text-lg leading-6 font-medium text-gray-900">
//               Hồ sơ
//             </h2>
//             {/* 3 cột: lg:grid-cols-3 */}
//             <dl className="mt-1 max-w-2xl text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 ">
//               <div className="sm:col-span-1">
//                 <dt className="font-medium text-gray-500">MSSV</dt>
//                 <dd className="mt-1">{users.username}</dd>
//               </div>
//               <div className="sm:col-span-1">
//                 <dt className="font-medium text-gray-500">Email</dt>
//                 <dd className="mt-1">{users.email}</dd>
//               </div>
//               <div className="sm:col-span-1">
//                 <dt className="font-medium text-gray-500">Điện thoại</dt>
//                 <dd className="mt-1">{users.phone??""}</dd>
//               </div>
//               <div className="sm:col-span-1">
//                 <dt className="font-medium text-gray-500">Ngày sinh</dt>
//                 <dd className="mt-1">{users.date_of_birth??""}</dd>
//               </div>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// }
// import { useCallback, useEffect, useState } from "react";
// import { useDispatch, useStore } from "react-redux";
// import axios from "axios";
// import jwt_decode from "jwt-decode";
// import { Avatar, Spinner } from "flowbite-react";
// import { setToken } from "../../store/authSlice";

// export default function Profile() {
//   const token = useStore().getState().auth.token;
//   const decoded = jwt_decode(token);
//   const username = decoded.username;
//   const dispatch = useDispatch();
//   const [users, setUsers] = useState(null);
//   const [file, setFile] = useState(null); // state lưu trữ file đã chọn

//   const fetchData = useCallback(async () => {
//     try {
//       const { data, status } = await axios.get(`/user/get/${username}`);
//       if (status === 200) {
//         setUsers(data);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         dispatch(setToken(""));
//       }
//     }
//   }, [dispatch, username]);

//   useEffect(() => {
//     document.title = "Hồ sơ";
//     fetchData();
//   }, [fetchData]);

//   const baseUrl = "http://localhost:8070/";

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]); // lưu trữ file đã chọn vào state
//   };

//   const handleUploadAvatar = async () => {
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       try {
//         const { status, data } = await axios.post(
//           `/upload/${username}`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         if (status === 200) {
//           setUsers((prevState) => ({
//             ...prevState,
//             avatar: data.message.split(": ")[1], // cập nhật lại state users với avatar mới
//           }));
//           setFile(null); // xóa file đã chọn sau khi upload thành công
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   return users === null ? (
//     <Spinner color="failure" />
//   ) : (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="py-8">
//         <div className="flex items-center justify-center">
//           <div className="flex-shrink-0">
//             <div className="relative">
//               <Avatar
//                 className="shadow-md shadow-black rounded-full bg-cyan-300"
//                 alt="Default avatar with alt text"
//                 img={baseUrl + "image/" + (users?.avatar ?? "")}
//                 rounded={true}
//                 size="xl"
//                 bordered={true}
//                 color="pink"
//               />
//               <input type="file" onChange={handleFileChange} />
//               <button onClick={handleUploadAvatar}>Upload</button>
//             </div>
//           </div>
//         </div>
//         // Render user info here
//       </div>
//     </div>
//   );
// }
