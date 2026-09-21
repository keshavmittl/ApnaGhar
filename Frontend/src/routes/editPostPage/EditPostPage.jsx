import { useMemo, useState } from "react";
import "../newPostPage/newPostPage.scss";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useLoaderData, useNavigate } from "react-router-dom";

const parseOptionalNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

function EditPostPage() {
  const post = useLoaderData();
  const navigate = useNavigate();

  const [value, setValue] = useState(post.postDetail?.desc || "");
  const [images, setImages] = useState(post.images || []);
  const [error, setError] = useState("");

  const defaultAvailableFrom = useMemo(() => {
    if (!post.availableFrom) return "";
    return new Date(post.availableFrom).toISOString().split("T")[0];
  }, [post.availableFrom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    if (!inputs.title?.trim()) {
      setError("Please enter a property title.");
      return;
    }

    if (!inputs.address?.trim()) {
      setError("Please enter the property address.");
      return;
    }

    if (!inputs.city?.trim()) {
      setError("Please enter the city.");
      return;
    }

    if (!inputs.price || Number.isNaN(parseInt(inputs.price, 10))) {
      setError("Please enter a valid price.");
      return;
    }

    if (!inputs.bedroom || Number.isNaN(parseInt(inputs.bedroom, 10))) {
      setError("Please enter the number of bedrooms.");
      return;
    }

    if (!inputs.bathroom || Number.isNaN(parseInt(inputs.bathroom, 10))) {
      setError("Please enter the number of bathrooms.");
      return;
    }

    if (!images.length) {
      setError("Please upload at least one property image.");
      return;
    }

    try {
      const res = await apiRequest.put(`/posts/${post.id}`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price, 10),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom, 10),
          bathroom: parseInt(inputs.bathroom, 10),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images,
          availableFrom: inputs.availableFrom
            ? new Date(inputs.availableFrom)
            : null,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseOptionalNumber(inputs.size),
          school: parseOptionalNumber(inputs.school),
          bus: parseOptionalNumber(inputs.bus),
          restaurant: parseOptionalNumber(inputs.restaurant),
        },
      });

      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "We couldn't update this property right now. Please try again."
      );
    }
  };

  return (
    <div className="newPostPage container">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <p className="formContainer__sub">
          Update the details of your listing — buyers see changes instantly.
        </p>

        <form onSubmit={handleSubmit} className="postForm">
          <fieldset className="postForm__section">
            <legend>Basics</legend>
            <div className="postForm__grid">
              <div className="item item--full">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={post.title}
                />
              </div>
              <div className="item">
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={post.price}
                />
              </div>
              <div className="item">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={post.city}
                />
              </div>
              <div className="item item--full">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  defaultValue={post.address}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="postForm__section">
            <legend>Property details</legend>
            <div className="postForm__grid">
              <div className="item">
                <label htmlFor="type">Listing type</label>
                <select name="type" defaultValue={post.type}>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
              <div className="item">
                <label htmlFor="property">Property type</label>
                <select name="property" defaultValue={post.property}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="item">
                <label htmlFor="bedroom">Bedrooms</label>
                <input
                  min={1}
                  id="bedroom"
                  name="bedroom"
                  type="number"
                  defaultValue={post.bedroom}
                />
              </div>
              <div className="item">
                <label htmlFor="bathroom">Bathrooms</label>
                <input
                  min={1}
                  id="bathroom"
                  name="bathroom"
                  type="number"
                  defaultValue={post.bathroom}
                />
              </div>
              <div className="item">
                <label htmlFor="availableFrom">Available from</label>
                <input
                  id="availableFrom"
                  name="availableFrom"
                  type="date"
                  defaultValue={defaultAvailableFrom}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="postForm__section">
            <legend>Location on map</legend>
            <div className="postForm__grid">
              <div className="item">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  defaultValue={post.latitude}
                />
              </div>
              <div className="item">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  defaultValue={post.longitude}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="postForm__section">
            <legend>Policies</legend>
            <div className="postForm__grid">
              <div className="item">
                <label htmlFor="utilities">Utilities policy</label>
                <select
                  name="utilities"
                  defaultValue={post.postDetail?.utilities || "owner"}
                >
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              <div className="item">
                <label htmlFor="pet">Pet policy</label>
                <select
                  name="pet"
                  defaultValue={post.postDetail?.pet || "allowed"}
                >
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
              <div className="item item--full">
                <label htmlFor="income">Income policy</label>
                <input
                  id="income"
                  name="income"
                  type="text"
                  placeholder="Income Policy"
                  defaultValue={post.postDetail?.income || ""}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="postForm__section">
            <legend>Size &amp; nearby places</legend>
            <div className="postForm__grid">
              <div className="item">
                <label htmlFor="size">Total size (sqft)</label>
                <input
                  min={0}
                  id="size"
                  name="size"
                  type="number"
                  defaultValue={post.postDetail?.size ?? ""}
                />
              </div>
              <div className="item">
                <label htmlFor="school">Distance to school (m)</label>
                <input
                  min={0}
                  id="school"
                  name="school"
                  type="number"
                  defaultValue={post.postDetail?.school ?? ""}
                />
              </div>
              <div className="item">
                <label htmlFor="bus">Distance to bus stop (m)</label>
                <input
                  min={0}
                  id="bus"
                  name="bus"
                  type="number"
                  defaultValue={post.postDetail?.bus ?? ""}
                />
              </div>
              <div className="item">
                <label htmlFor="restaurant">Distance to restaurant (m)</label>
                <input
                  min={0}
                  id="restaurant"
                  name="restaurant"
                  type="number"
                  defaultValue={post.postDetail?.restaurant ?? ""}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="postForm__section">
            <legend>Description</legend>
            <div className="item item--full">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={8}
              />
            </div>
          </fieldset>

          <button className="btn btn--primary sendButton">Save changes</button>
          {error && <p className="postForm__error">{error}</p>}
        </form>
      </div>

      <div className="sideContainer">
        <h2>Property photos</h2>
        <div className="sideContainer__previews">
          {!images.length && (
            <div className="imageSkeleton">
              <div className="imageSkeleton__icon">+</div>
              <p>Upload property photos to preview them here.</p>
            </div>
          )}
          {images.map((image, index) => (
            <img src={image} key={index} alt="" />
          ))}
        </div>
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dvf3kntug",
            uploadPreset: "estate",
            maxImageFileSize: 2000000,
            folder: "posts",
          }}
          setState={setImages}
          label="Add more photos"
        />
        <span className="uploadHint">
          Upload more photos to replace or expand the current gallery.
        </span>
      </div>
    </div>
  );
}

export default EditPostPage;