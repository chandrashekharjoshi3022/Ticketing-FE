import { useDispatch, useSelector } from "react-redux";
import { fetchItems, addItem, deleteItem, updateItem } from "../redux/slices/itemSlice";
import { useEffect, useState } from "react";

export default function Items() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.list);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleAdd = () => {
    if (newItem.trim()) {
      dispatch(addItem(newItem));
      setNewItem("");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const handleUpdate = (id) => {
    if (editValue.trim()) {
      dispatch(updateItem({ id, name: editValue }));
      setEditingId(null);
      setEditValue("");
    }
  };

  return (
    <div>
      <h2>Items</h2>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="New item"
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {editingId === i.id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button onClick={() => handleUpdate(i.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {i.name}
                <button onClick={() => handleEdit(i)}>Edit</button>
                <button onClick={() => dispatch(deleteItem(i.id))}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
