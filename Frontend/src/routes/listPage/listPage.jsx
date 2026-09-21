import { Suspense } from "react";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";

function ListPage() {
  const data = useLoaderData();
  return (
    <div className="listPage">
      <div className="container listPage__filter">
        <Filter />
      </div>
      <div className="container listPage__grid">
        <div className="listPage__results">
          <Suspense fallback={<p className="listPage__loading">Loading homes…</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) => {
                if (!postResponse || !postResponse.data) {
                  return <p>No posts available</p>;
                }
                if (!postResponse.data.length) {
                  return (
                    <div className="listPage__empty">
                      <h2>No homes found</h2>
                      <p>
                        Try adjusting your filters or searching a different city.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="listPage__cards">
                    {postResponse.data.map((post) => (
                      <Card key={post.id} item={post} />
                    ))}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>
        <div className="listPage__map">
          <Suspense fallback={<p className="listPage__loading">Loading map…</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) => {
                if (!postResponse || !postResponse.data) {
                  return <p>No posts available</p>;
                }
                return <Map items={postResponse.data} />;
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;