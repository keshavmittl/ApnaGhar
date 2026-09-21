import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/authContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "We couldn't update your profile right now. Please try again."
      );
    }
  };

  return (
    <div className="profileUpdatePage container">
      <div className="formContainer">
        <form className="profileUpdateForm" onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <p className="profileUpdateForm__sub">
            Keep your details up to date so owners can reach you.
          </p>

          <label className="item">
            <span>Username</span>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </label>

          <label className="item">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </label>

          <label className="item">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </label>

          <button className="btn btn--primary profileUpdateForm__submit">
            Update profile
          </button>
          {error && <p className="profileUpdateForm__error">{error}</p>}
        </form>
      </div>

      <div className="sideContainer">
        <h2>Profile photo</h2>
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "dvf3kntug",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
          label="Choose a new photo"
        />
        <span className="uploadHint">
          A clear photo helps owners recognise you. Max 2 MB.
        </span>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;