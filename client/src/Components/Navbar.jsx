import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../atoms";
import { axiosInstance } from "../axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const [message, setMessage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/me");
        console.log(res);
        if (res.data.success) {
          const resData = res.data.user;
          setUser({
            id: resData.id,
            fname: resData.firstName,
            lname: resData.lastName,
            email: resData.email,
            isAdmin: resData.isAdmin,
            role: resData.role,
          });
        } else {
          setMessage({
            color: "bg-red-400",
            msg: "Session Invalid, Logging Out!",
          });
          handleLogout();
        }
      } catch (e) {
        console.log(e);
        setMessage({ color: "bg-yellow-400", msg: "Please Login" });
      }
    };
    fetchUser();
    setTimeout(() => {
      setMessage({});
    }, 5000);
    const interval = setInterval(fetchUser, 3600000);
    return () => clearInterval(interval);
  }, [setUser]);

  const handleNav = async (type) => {
    navigate("/" + type);
  };

  //LOGOUT
  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/api/user/logout");
      if (res.data.success) {
        setMessage({
          color: "bg-green-500",
          msg: "✅ Logged out successfully.",
        });
      } else {
        setMessage({
          color: "bg-yellow-400",
          msg: "⚠️ Logged out locally (session expired).",
        });
      }
    } catch (e) {
      console.warn("Token may be expired. Logging out locally.");
      setMessage({
        color: "bg-yellow-400",
        msg: "⚠️ Session expired. Logged out locally.",
      });
    }
    setUser({
      id: null,
      fname: "",
      lname: "",
      email: "",
      isAdmin: false,
      role: "Employee",
    });
    localStorage.clear();
    setTimeout(() => {
      setMessage({});
    }, 5000);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
        <button
          onClick={() => handleNav("")}
          className="text-2xl font-bold text-blue-700"
        >
          JobBoard
        </button>
        {user.id === null ? (
          <></>
        ) : (
          <button
            onClick={() => {
              user.role === "Company" ? handleNav("") : handleNav("jobSearch");
            }}
            className="text-blue-600 italic font-medium hover:underline hover:text-blue-500"
          >
            {user.role === "Company" ? "Create" : "Apply"}
          </button>
        )}

        <div className="space-x-4">
          {user.fname !== "" ? (
            <div className="flex flex-row items-center gap-4">
              <p className="text-blue-600 font-medium">Hi, {user.fname}</p>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={() => handleNav("signin")}
                className="text-blue-600 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => handleNav("signup")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Message */}
      {message.msg && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 ${message.color} text-white px-6 py-3 rounded-md shadow-md z-50 transition-all duration-300`}
        >
          {message.msg}
        </div>
      )}
    </>
  );
}

export default Navbar;
