import { useEffect, useMemo, useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

// Values that mean "no preference" and should never end up in the query string.
const isMeaningfulValue = (key, value) => {
  if (value === undefined || value === null) return false;
  const trimmed = String(value).trim();
  if (trimmed === "") return false;
  if (key === "bedroom" && trimmed === "any") return false;
  return true;
};

const buildQueryString = (query) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (isMeaningfulValue(key, value)) params.set(key, String(value).trim());
  });
  return params;
};

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramsQuery = useMemo(
    () => ({
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      property: searchParams.get("property") || "",
      minPrice: searchParams.get("minPrice") || 0,
      maxPrice: searchParams.get("maxPrice") || 10000000,
      // `bedroom` used to default to the literal string "any" and was pushed
      // into the URL as `bedroom=any`, which the API cannot parse.
      bedroom: searchParams.get("bedroom") || "",
    }),
    [searchParams]
  );

  const [query, setQuery] = useState(paramsQuery);

  useEffect(() => {
    // Re-sync the boxes whenever the URL changes, including browser back/forward.
    setQuery(paramsQuery);
  }, [paramsQuery]);

  const handleChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilter = () => {
    setSearchParams(buildQueryString(query));
  };

  const cityName = searchParams.get("city");
  const typeName = searchParams.get("type");

  return (
    <div className="filter">
      <div className="filter__head">
        <h1>
          {cityName ? (
            <>
              Homes in <b>{cityName}</b>
            </>
          ) : (
            <>Explore all homes</>
          )}
        </h1>
        {typeName && (
          <span className="filter__typeChip">
            {typeName === "buy" ? "For Sale" : "For Rent"}
          </span>
        )}
      </div>

      <div className="filter__panel">
        <div className="item item--wide">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City, locality or area"
            onChange={handleChange}
            value={query.city}
          />
        </div>

        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            id="property"
            name="property"
            onChange={handleChange}
            value={query.property}
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="minPrice">Min price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>

        <div className="item">
          <label htmlFor="maxPrice">Max price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>

        <div className="item">
          <label htmlFor="bedroom">Bedrooms</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>

        <button type="button" className="filter__apply" onClick={handleFilter}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" />
            <path
              d="M16.5 16.5 L21 21"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          Search
        </button>
      </div>
    </div>
  );
}

export default Filter;