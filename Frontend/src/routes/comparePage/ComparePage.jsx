import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import "./comparePage.scss";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      apiRequest
        .get(`/posts/multiple?ids=${ids}`)
        .then((res) => setProperties(res.data))
        .catch((err) => console.error(err));
    }
  }, [searchParams]);

  const fields = [
    { label: "Price", key: "price", formatPrice: true },
    { label: "Type", key: "type", formatType: true },
    { label: "Property", key: "property", formatProperty: true },
    { label: "Bedroom", key: "bedroom" },
    { label: "Bathroom", key: "bathroom" },
    { label: "Address", key: "address" },
    { label: "Utilities", key: "utilities", nested: true },
    { label: "Pet Policy", key: "pet", nested: true },
    { label: "Income Policy", key: "income", nested: true },
    { label: "Size", key: "size", nested: true, suffix: " sqft" },
    {
      label: "School Distance",
      key: "school",
      nested: true,
      formatDistance: true,
    },
    {
      label: "Bus Stop Distance",
      key: "bus",
      nested: true,
      formatDistance: true,
    },
    {
      label: "Restaurant Distance",
      key: "restaurant",
      nested: true,
      formatDistance: true,
    },
  ];

  const formatDistance = (value) => {
    if (value > 999) return `${value / 1000} km`;
    return `${value} m`;
  };

  const formatValue = (item, { key, nested, formatPrice: isPrice, formatType, formatProperty, formatDistance: isDistance, suffix }) => {
    let value = nested ? item.postDetail?.[key] : item[key];

    if (isPrice) return formatPrice(value);
    if (formatType) return value === "buy" ? "For Sale" : "For Rent";
    if (formatProperty) return value;
    if (key === "utilities") {
      value =
        value === "owner"
          ? "Owner is responsible"
          : value === "shared"
            ? "Shared"
            : "Tenant is responsible";
    }
    if (key === "pet") {
      value = value === "allowed" ? "Pets allowed" : "Pets not allowed";
    }
    if (isDistance) value = formatDistance(value);
    if (suffix && value !== undefined && value !== null && value !== "") {
      value = value + suffix;
    }

    return value || "—";
  };

  return (
    <div className="comparePage container">
      <div className="section-head comparePage__head">
        <span className="section-head__eyebrow">Side by side</span>
        <h1>Compare Properties</h1>
        <p className="section-head__sub">
          See how your shortlisted homes stack up — different values are
          highlighted in saffron.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="comparePage__empty">
          <p>Select at least two saved homes from your profile to compare.</p>
        </div>
      ) : (
        <div className="compareTable">
          <div className="compareRow compareRow--headers">
            <div className="compareLabel compareLabel--empty" />
            {properties.map((item) => (
              <div className="compareHeader" key={item.id}>
                <img src={item.images[0]} alt={item.title} />
                <b>{item.title}</b>
                {item.isBought && <span className="compareHeader__sold">SOLD</span>}
              </div>
            ))}
          </div>

          {fields.map((field) => {
            const values = properties.map((item) =>
              formatValue(item, field)
            );
            const isDifferent = new Set(values).size > 1;

            return (
              <div className="compareRow" key={field.key}>
                <div className="compareLabel">{field.label}</div>
                {values.map((value, index) => (
                  <div
                    className={`compareCell ${isDifferent ? "highlight" : ""}`}
                    key={properties[index].id + field.key}
                  >
                    {value}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComparePage;