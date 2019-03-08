import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Typography } from "@smooth-ui/core-sc";
import { ReactComponent as IconPen } from "../../svgs/pencil.svg";
import { ReactComponent as IconHome } from "../../svgs/home.svg";

export function View({ data }) {
  if (_.isEmpty(data)) {
    return null;
  }

  const { id, message, keyword } = data;
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
      <Header>
        <Typography variant="h1">{keyword}</Typography>
        <HomeLink to={`/passages`} tabIndex="-1">
          <IconHome width="24" height="24" fill="#666" />
        </HomeLink>
        <EditLink to={`/passages/edit/${id}`} tabIndex="-1">
          <IconPen width="24" height="24" fill="#666" />
        </EditLink>
      </Header>
      <Body>
        {verses.map(({ number, message }, i) => (
          <Verse
            name={number}
            key={number}
            isOdd={(number - 1) % 2 === 0}
            tabIndex="0"
          >
            <Label>{number}</Label>
            <Content>{message}</Content>
          </Verse>
        ))}
      </Body>
    </div>
  );
}

const Verse = styled.a`
  line-height: 1.5;
  color: ${props => (props.isOdd ? "#222" : "#007eba")};
  outline: none;
  &:focus {
    border-bottom: 1px dotted #ff8331;
    background-color: rgba(255, 239, 120, 0.6);
  }
  /* &:hover {
    background: yellow;
  } */
`;
const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  position: relative;
`;
const HomeLink = styled(Link)`
  position: absolute;
  left: 30px;
  top: 15px;
`;
const EditLink = styled(Link)`
  position: absolute;
  right: 30px;
  top: 15px;
`;
const Body = styled.div`
  margin: 0 50px;
`;
const Label = styled.span`
  font-size: 24px;
  vertical-align: top;
`;
const Content = styled.span`
  font-size: 36px;
`;
