import React, { useState } from "react";
import { Form, Listing, View } from "./modules/passages";
import { usePassages } from "./modules/passages/hooks";

function App() {
  const {
    passages,
    createPassage,
    updatePassage,
    deletePassage
  } = usePassages();
  const [selectedPassage, setSelectedPassage] = useState(null);

  const handleSelect = id => {
    const passage = passages.find(p => p.id === id);
    if (passage) setSelectedPassage(passage);
  };

  const handleDelete = id => {
    deletePassage(id);
  };

  const handleSave = form => {
    const id = form.id;
    if (id) {
      updatePassage(id, form);
    } else {
      createPassage(form);
    }
  };

  return (
    <div>
      <Listing
        data={passages}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
      <View data={selectedPassage} />
      <Form data={selectedPassage} onSave={handleSave} />
    </div>
  );
}

export default App;
