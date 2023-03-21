import axios from "axios";
import { Button, Card, Label, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { setToken } from "../../../../store/authSlice";
function SendFeedback() {
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Gửi phản hồi";
  }, []);
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: Yup.object({
      content: Yup.string().required("Không được để trống trường này"),
    }),
    onSubmit: async (value) => {
      //console.log(data);
      try {
        const { status } = await axios.post("/feedback/create", value);
        if (status === 201) {
          toast.success("Gửi phản hồi thành công!");
        }
        if (status === 204) {
          toast.warning("Phản hồi đã tồn tại. Vui lòng hỏi lại sau!");
        }
      } catch (error) {
        if (error.response.status === 403) {
          dispatch(setToken(""));
        }
        
      }
    },
  });
  return (
    <Card>
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <div id="textarea">
        <div className="mb-2 block">
          <Label htmlFor="content" value="Phản hồi chat" className="text-xl" />
        </div>
        <Textarea
          id="content"
          name="content"
          placeholder="Nhập tin nhắn vào đây..."
          rows={4}
          value={formik.values.content}
          onChange={formik.handleChange}
          color={formik.errors.content && "failure"}
        />
        {formik.errors.content && (
          <p style={{ textAlign: "left" }} className="text-red-500">
            {formik.errors.content}
          </p>
        )}
      </div>
      <Button gradientDuoTone="greenToBlue" type="submit">
        Gửi phản hồi
      </Button>
    </form>
    </Card>
  );
}

export default SendFeedback;
