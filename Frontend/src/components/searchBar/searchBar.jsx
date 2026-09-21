import { useState } from "react";
import "./searchBar.scss";
import { useNavigate } from "react-router-dom";

const types = ["buy", "rent"];
function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 10000000,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };
  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    // Without this the form did a native GET and reloaded the whole page.
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("type", query.type);
    if (query.city.trim()) params.set("city", query.city.trim());
    if (query.minPrice !== "") params.set("minPrice", query.minPrice);
    if (query.maxPrice !== "") params.set("maxPrice", query.maxPrice);

    navigate(`/list?${params.toString()}`);
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="searchBar__form">
        <label className="field field--city">
          <img src="/pin.png" alt="" aria-hidden="true" />
          <input
            type="text"
            name="city"
            placeholder="City, locality or area"
            aria-label="City"
            value={query.city}
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <input
            type="number"
            name="minPrice"
            min={0}
            max={100000000}
            placeholder="Min price"
            aria-label="Minimum price"
            value={query.minPrice}
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <input
            type="number"
            name="maxPrice"
            min={0}
            max={100000000}
            placeholder="Max price"
            aria-label="Maximum price"
            value={query.maxPrice}
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
          className="searchButton"
          aria-label="Search properties"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" />
            <path
              d="M16.5 16.5 L21 21"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;