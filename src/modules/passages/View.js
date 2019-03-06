import _ from "lodash";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography } from "@smooth-ui/core-sc";

export function View({ data }) {
  if (_.isEmpty(data)) {
    return null;
  }

  const { message, keyword } = data;
  const [verses, setVerses] = useState([]);
  useEffect(() => {
    const regExp = /([\d]+)([^\d]+)/gm;
    let matches;
    const verses = [];
    while ((matches = regExp.exec(message))) {
      verses.push({ number: matches[1], message: matches[2] });
    }
    setVerses(verses);
  }, [message]);

  return (
    <div>
      <Typography variant="h1">{keyword}</Typography>

      {verses.map(({ number, message }, i) => (
        <Verse name={number} key={number} isOdd={i % 2 === 0} tabIndex="0">
          <Label>{number}</Label>
          <Content>{message}</Content>
        </Verse>
      ))}
    </div>
  );
}

const Verse = styled.a`
  line-height: 1.5;
  color: ${props => (props.isOdd ? "#000" : "#369")};
  outline: none;
  &:focus {
    border-bottom: 1px dotted #ccc;
  }
  /* &:hover {
    background: yellow;
  } */
`;
const Label = styled.span`
  font-size: 24px;
  vertical-align: top;
`;
const Content = styled.span`
  font-size: 36px;
`;
