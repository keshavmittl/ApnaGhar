import "./pin.scss";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const Pin = ({ item }) => {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <div className="popupContainer__media">
            <img src={item.images[0]} alt={item.title} />
            {item.isBought && <span className="popupContainer__sold">SOLD</span>}
          </div>
          <div className="popupContainer__text">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span className="popupContainer__bed">
              {item.bedroom} bedroom · {item.bathroom} bath
            </span>
            <b>{formatPrice(item.price)}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;