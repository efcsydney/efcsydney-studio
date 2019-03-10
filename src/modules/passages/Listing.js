import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, Link, Text } from "rebass";
import styled from "styled-components";
import { useSearchPassage, useForm } from "./hooks";
import { ReactComponent as IconClose } from "../../svgs/close.svg";

function Listing({ data, onDelete, onAdd }) {
  const { form, setForm } = useForm();
  const { searchPassage } = useSearchPassage();

  function handleQuickAddSubmit(e) {
    e.preventDefault();
    searchPassage(form.version, form.keyword).then(passage => {
      onAdd({ ...form, message: passage });
    });
  }

  function handleQuickAddChange(e) {
    e.preventDefault();
    setForm({ ...form, keyword: e.target.value });
  }

  return (
    <Wrapper>
      <h2>Reading</h2>
      <Flex>
        <Box mx="auto" alignSelf="center">
          {data.map(item => (
            <Verse key={item.id} to={`/passages/show/${item.id}`}>
              <Text textAlign="center">{item.keyword}</Text>
              <DeleteLink
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <IconClose fill="white" width="12" height="12" />
              </DeleteLink>
            </Verse>
          ))}
          <Verse to={`/passages/new`}>Create Passage</Verse>
          <form onSubmit={handleQuickAddSubmit}>
            QuickAdd:{" "}
            <QuickAdd
              type="text"
              name="keyword"
              value={form.keyword}
              onChange={handleQuickAddChange}
              placeholder="Passage (e.g. 1 Cor 13:13-15)"
            />
          </form>
        </Box>
      </Flex>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  text-align: center;
`;

const Verse = props => (
  <Link
    {...props}
    as={RouterLink}
    display="block"
    boxShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
    border="1px solid #ccc"
    borderRadius={2}
    bg="#f6f6ff"
    p={3}
    mb={3}
    css={{ display: "block", position: "relative" }}
  />
);

const DeleteLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  position: absolute;
  border-radius: 50%;
  background: red;
  width: 20px;
  height: 20px;
  top: -10px;
  right: -10px;
`;

const QuickAdd = styled.input`
  padding: 10px;
  outline: none;
  border-radius: 20px;
  border: solid 1px #ccc;
  display: inline-block;
  width: 300px;
  margin: 0 auto;
`;

export { Listing };
