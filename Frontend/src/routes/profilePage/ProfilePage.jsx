import { Suspense, useContext, useState } from "react";
import "./profilePage.scss";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const data = useLoaderData();
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCompare = (id) => {
    id = String(id);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedIds.length > 3) {
      toast.error("You can only compare up to 3 properties!");
      return;
    }

    const params = new URLSearchParams();
    params.set("ids", selectedIds.join(","));
    navigate(`/compare?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profilePage container">
      <div className="profilePage__main">
        <div className="profileCard">
          <img
            src={currentUser.avatar || "/noavatar.jpg"}
            alt=""
            className="profileCard__avatar"
          />
          <div className="profileCard__info">
            <h1>{currentUser.username}</h1>
            <p>{currentUser.email}</p>
          </div>
          <div className="profileCard__actions">
            <Link to="/profile/update" className="btn btn--light">
              Edit profile
            </Link>
            <button
              type="button"
              className="btn btn--ghost profileCard__logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="section">
          <div className="section__head">
            <h2>My Listings</h2>
            <Link to="/add" className="btn btn--primary">
              + Create New Post
            </Link>
          </div>
          <Suspense fallback={<p className="section__loading">Loading…</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) => (
                <List posts={postResponse.data.userPosts} showEdit={true} />
              )}
            </Await>
          </Suspense>
        </div>

        <div className="section">
          <div className="section__head">
            <h2>Saved Homes</h2>
            {selectedIds.length >= 2 && (
              <button
                type="button"
                className="btn btn--accent"
                onClick={handleCompare}
              >
                Compare {selectedIds.length} properties
              </button>
            )}
          </div>
          <Suspense fallback={<p className="section__loading">Loading…</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) => (
                <List
                  posts={postResponse.data.savedPosts}
                  compareMode={true}
                  selectedIds={selectedIds}
                  toggleCompare={toggleCompare}
                />
              )}
            </Await>
          </Suspense>
        </div>

        <div className="section">
          <div className="section__head">
            <h2>Bought Properties</h2>
          </div>
          <Suspense fallback={<p className="section__loading">Loading…</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) => <List posts={postResponse.data.boughtPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;