import { object, string, TypeOf } from "zod";
import { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import useStore from "../store";
import { authApi } from "../api/authApi";
import { GenericResponse } from "../api/types";

const resetPasswordSchema = object({
  password: string().min(1, "Current password is required"),
  passwordConfirm: string().min(1, "Please confirm your password"),
});

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const store = useStore();
  const navigate = useNavigate();
  const { resetCode } = useParams();

  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const resetPassword = async (data: ResetPasswordInput) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.patch<GenericResponse>(
        `auth/resetpassword/${resetCode}`,
        data
      );
      store.setRequestLoading(false);
      toast.success(response.data.message as string, {
        position: "top-right",
      });
      navigate("/login");
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const onSubmitHandler: SubmitHandler<ResetPasswordInput> = (values) => {
    if (resetCode) {
      resetPassword(values);
    } else {
      toast.error("Please provide the password reset code", {
        position: "top-right",
      });
    }
  };
  return (
    <section className="bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-7">
          Reset Password
        </h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <FormInput label="New Password" name="password" type="password" />
            <FormInput
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
            />
            <LoadingButton
              loading={store.requestLoading}
              textColor="text-ct-blue-600"
            >
              Reset Password
            </LoadingButton>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
