import React from "react";
import styled from "styled-components";

function Listing({ data, onDelete, onSelect }) {
  if (!data.length) {
    return null;
  }

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>
          <span onClick={() => onSelect(item.id)}>
            {item.keyword} ({item.version.toUpperCase()})
          </span>
          <DeleteLink onClick={() => onDelete(item.id)}>Delete</DeleteLink>
        </li>
      ))}
    </ul>
  );
}

const DeleteLink = styled.a`
  color: red;
  margin-left: 5px;
`;

export { Listing };
