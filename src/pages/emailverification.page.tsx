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

const emailVerificationSchema = object({
  verificationCode: string().min(1, "Email verifciation code is required"),
});

export type EmailVerificationInput = TypeOf<typeof emailVerificationSchema>;

const EmailVerificationPage = () => {
  const store = useStore();
  const navigate = useNavigate();
  const { verificationCode } = useParams();

  const methods = useForm<EmailVerificationInput>({
    resolver: zodResolver(emailVerificationSchema),
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (verificationCode) {
      setValue("verificationCode", verificationCode);
    }
  }, []);

  const verifyEmail = async (data: EmailVerificationInput) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.get<GenericResponse>(
        `auth/verifyemail/${data.verificationCode}`
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

  const onSubmitHandler: SubmitHandler<EmailVerificationInput> = (values) => {
    verifyEmail(values);
  };
  return (
    <section className="bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-7">
          Verify Email Address
        </h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
          >
            <FormInput label="Verification Code" name="verificationCode" />
            <LoadingButton
              loading={store.requestLoading}
              textColor="text-ct-blue-600"
            >
              Verify Email
            </LoadingButton>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default EmailVerificationPage;
