import Card from "../card/Card";
import "./list.scss";

const List = ({
  posts,
  compareMode = false,
  selectedIds = [],
  toggleCompare,
  showEdit = false,
}) => {
  if (!posts?.length) {
    return <p className="list__empty">No properties here yet.</p>;
  }

  return (
    <div className="list">
      {posts.map((post) => (
        <Card
          key={post.id}
          item={post}
          compareMode={compareMode}
          isSelected={selectedIds.includes(String(post.id))}
          toggleCompare={toggleCompare}
          showEdit={showEdit}
        />
      ))}
    </div>
  );
};

export default List;