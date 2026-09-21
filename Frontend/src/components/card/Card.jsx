import "./card.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { toast } from "react-toastify";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function Card({
  item,
  compareMode = false,
  isSelected = false,
  toggleCompare,
  showEdit = false,
}) {
  const isComingSoon = item.comingSoon;

  const getAvailableInText = () => {
    if (!item.availableFrom) return null;

    const availableDate = new Date(item.availableFrom);
    const today = new Date();
    const diffTime = availableDate - today;

    if (diffTime <= 0) return null;

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `Available in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  const availableInText = getAvailableInText();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await apiRequest.delete(`/posts/${item.id}`);
      toast.success("Listing deleted successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  return (
    <article
      className={`card ${isSelected ? "selected" : ""} ${
        isComingSoon ? "comingSoon" : ""
      }`}
    >
      {compareMode && (
        <div className="checkboxWrapper">
          <input
            type="checkbox"
            className="compareCheckbox"
            checked={isSelected}
            onChange={() => toggleCompare(item.id)}
            aria-label={`Compare ${item.title}`}
          />
          <span className="tooltip">Compare this</span>
        </div>
      )}

      <Link to={`/${item.id}`} className="card__media">
        <img src={item.images[0]} alt={item.title} loading="lazy" />
        <div className="card__mediaOverlay" />
        {/* Show a soft heads-up for listings that are not available just yet. */}
        {availableInText && <span className="soonTag">{availableInText}</span>}
        {item.isBought && <div className="soldBanner">SOLD</div>}
        <span className="card__type">{item.type}</span>
      </Link>

      <div className="card__body">
        <div className="card__top">
          <p className="card__price">{formatPrice(item.price)}</p>
          <p className="card__address">
            <img src="/pin.png" alt="" aria-hidden="true" />
            <span>{item.address}</span>
          </p>
        </div>

        <h2 className="card__title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>

        <div className="card__bottom">
          <div className="card__features">
            <span className="card__feature">
              <img src="/bed.png" alt="" aria-hidden="true" />
              {item.bedroom} BHK
            </span>
            <span className="card__feature">
              <img src="/bath.png" alt="" aria-hidden="true" />
              {item.bathroom} bath
            </span>
            {item.postDetail?.size && (
              <span className="card__feature card__feature--size">
                {item.postDetail.size} sqft
              </span>
            )}
          </div>
          {showEdit && (
            <div className="card__actions">
              <Link to={`/edit/${item.id}`} className="editButton">
                Edit
              </Link>
              <button onClick={handleDelete} className="deleteButton">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default Card;