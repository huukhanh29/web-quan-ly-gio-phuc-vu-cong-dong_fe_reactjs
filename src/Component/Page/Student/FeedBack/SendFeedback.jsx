import axios from "axios";
import { Button, Card, Label, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { setToken } from "../../../../store/authSlice";
function SendFeedback() {
  const dispatch = useDispatch();
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
          <Label htmlFor="content" value="Your message" className="text-xl" />
        </div>
        <Textarea
          id="content"
          name="content"
          placeholder="Leave a comment..."
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
        Send Feedback
      </Button>
    </form>
    </Card>
  );
}

export default SendFeedback;
