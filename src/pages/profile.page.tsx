import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";
import { IUserResponse } from "../api/types";
import useStore from "../store";

const ProfilePage = () => {
  const store = useStore();
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.get<IUserResponse>("/users/me");
      store.setRequestLoading(false);
      store.setAuthUser(response.data.data.user);
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
      navigate("/login");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const user = store.authUser;

  return (
    <section className="bg-ct-blue-600  min-h-screen pt-20">
      <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
        <div>
          <p className="text-5xl font-semibold">Profile Page</p>
          <div className="mt-8">
            <p className="mb-4">ID: {user?.id}</p>
            <p className="mb-4">Name: {user?.name}</p>
            <p className="mb-4">Email: {user?.email}</p>
            <p className="mb-4">Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
