import { useContext, useState } from "react";
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import apiRequest from "../../lib/apiRequest";
import { toast } from "react-toastify";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDistance = (value) => {
  if (!value) return "—";
  if (value > 999) return `${value / 1000} km away`;
  return `${value} m away`;
};

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const previous = saved;
    setSaved((prev) => !prev);

    try {
      await apiRequest.post("/users/save", { postId: post.id });
      toast.success(previous ? "Removed from saved homes" : "Saved to your homes");
    } catch (error) {
      console.log(error);
      setSaved(previous);
      toast.error(
        error.response?.data?.message ||
          "We couldn't update your saved properties. Please try again."
      );
    }
  };

  const handlePayment = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await apiRequest.post("/payment/create-order", {
        amount: post.price,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "Apna Ghar",
        description: "Property Purchase",
        handler: async function (response) {
          toast.success("Payment Successful!");
          await apiRequest.post(`/posts/buy/${post.id}`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          navigate("/profile");
        },
        prefill: {
          name: currentUser.username,
          email: currentUser.email,
        },
        theme: {
          color: "#332316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Payment could not be started right now. Please try again later."
      );
    }
  };

  const isOwner = currentUser?.id === post.user.id;
  const isBought = post.isBought;
  const disablePayment = isBought || isOwner;
  const detail = post.postDetail || {};

  return (
    <div className="singlePage container">
      <div className="singlePage__main">
        <Slider images={post.images} />

        <div className="infoCard">
          <div className="infoCard__top">
            <div className="infoCard__post">
              <span className="infoCard__type">
                {post.type === "buy" ? "For Sale" : "For Rent"} · {post.property}
              </span>
              <h1>{post.title}</h1>
              <div className="infoCard__address">
                <img src="/pin.png" alt="" aria-hidden="true" />
                <span>{post.address}</span>
              </div>
              <div className="infoCard__price">{formatPrice(post.price)}</div>
            </div>
            <div className="infoCard__owner">
              <img src={post.user.avatar || "/noavatar.jpg"} alt="" />
              <div>
                <b>{post.user.username}</b>
                <span>Property owner</span>
              </div>
            </div>
          </div>

          <div className="infoCard__desc">{detail.desc}</div>

          <div className="infoCard__grid">
            <div className="infoCard__item">
              <span>Bedrooms</span>
              <b>{post.bedroom}</b>
            </div>
            <div className="infoCard__item">
              <span>Bathrooms</span>
              <b>{post.bathroom}</b>
            </div>
            <div className="infoCard__item">
              <span>Size</span>
              <b>{detail.size ? `${detail.size} sqft` : "—"}</b>
            </div>
            <div className="infoCard__item">
              <span>Type</span>
              <b className="capitalize">{post.property}</b>
            </div>
          </div>
        </div>
      </div>

      <aside className="singlePage__side">
        <div className="sideCard">
          <p className="sideCard__title">Good to know</p>
          <div className="sideCard__row">
            <span>Utilities</span>
            <b>
              {detail.utilities === "owner"
                ? "Owner is responsible"
                : detail.utilities === "shared"
                  ? "Shared"
                  : "Tenant is responsible"}
            </b>
          </div>
          <div className="sideCard__row">
            <span>Pet policy</span>
            <b>
              {detail.pet === "allowed" ? "Pets allowed" : "Pets not allowed"}
            </b>
          </div>
          <div className="sideCard__row">
            <span>Income policy</span>
            <b>{detail.income || "—"}</b>
          </div>
        </div>

        <div className="sideCard">
          <p className="sideCard__title">Nearby places</p>
          <div className="sideCard__nearby">
            <div className="nearby">
              <span>🏫</span>
              <div>
                <b>School</b>
                <p>{formatDistance(detail.school)}</p>
              </div>
            </div>
            <div className="nearby">
              <span>🚌</span>
              <div>
                <b>Bus stop</b>
                <p>{formatDistance(detail.bus)}</p>
              </div>
            </div>
            <div className="nearby">
              <span>🍽️</span>
              <div>
                <b>Restaurant</b>
                <p>{formatDistance(detail.restaurant)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sideCard">
          <p className="sideCard__title">Location</p>
          <div className="singlePage__map">
            <Map items={[post]} />
          </div>
        </div>

        <div className="singlePage__actions">
          <button
            className="btn btn--primary singlePage__action"
            onClick={() => {
              if (!currentUser) {
                navigate("/login");
              } else {
                navigate("?chatWith=" + post.user.id);
              }
            }}
          >
            💬 Send a Message
          </button>

          <button
            className={`btn singlePage__action ${
              saved ? "btn--accent" : "btn--light"
            }`}
            onClick={handleSave}
          >
            {saved ? "★ Saved" : "☆ Save the Place"}
          </button>

          <button
            className="btn btn--accent singlePage__action"
            onClick={handlePayment}
            disabled={disablePayment}
          >
            {isBought ? "Sold" : isOwner ? "You own this" : "🔒 Pay Now"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SinglePage;