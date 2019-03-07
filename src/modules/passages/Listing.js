import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@smooth-ui/core-sc";
import styled from "styled-components";

function Listing({ data, onDelete }) {
  if (!data.length) {
    return null;
  }

  return (
    <div>
      <Typography variant="h1">Today's Bible Reading</Typography>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <Link to={`/passages/show/${item.id}`}>
              {item.keyword} ({item.version.toUpperCase()})
            </Link>
            <Link to={`/passages/edit/${item.id}`}>Edit</Link>
            <DeleteLink onClick={() => onDelete(item.id)}>Delete</DeleteLink>
          </li>
        ))}
        <li>
          <Link to={`/passages/new`}>Create Passage</Link>
        </li>
      </ul>
    </div>
  );
}

const DeleteLink = styled.a`
  color: red;
  margin-left: 5px;
`;

export { Listing };
