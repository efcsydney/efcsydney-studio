import _ from "lodash";
import React from "react";
import styled from "styled-components";
import {
  Button,
  Input,
  Select,
  Textarea,
  Typography
} from "@smooth-ui/core-sc";
import { useForm, useSearchPassage } from "./hooks";
import { getBookName, parseKeyword } from "./utils";
import { ReactComponent as IconMagic } from "../../svgs/magic-wand.svg";

function Form({ data, onSave }) {
  const { form, setForm } = useForm(data);
  const { searchPassage } = useSearchPassage();

  const handleChange = key => e => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();

    onSave(form);
  };

  const handleSearchPassage = e => {
    e.preventDefault();

    searchPassage(form.version, form.keyword).then(passage => {
      const { book, chapter, range } = parseKeyword(form.keyword);
      const keyword = `${getBookName(book)} ${chapter} (${range})`;
      setForm({ ...form, message: passage, keyword });
    });
  };

  return (
    <Wrapper onSubmit={handleSave}>
      <Typography variant="h1">Edit</Typography>
      <Filter>
        <SearchInput
          value={form.keyword}
          placeholder="Enter passage (e.g. Mat 5:3-12)"
          autoFocus
          onChange={handleChange("keyword")}
        />
        <Select
          value={form.version}
          onChange={handleChange("version")}
          style={{ display: "none" }}
        >
          <option value="niv">NIV (New International Version)</option>
          <option value="asv">ASV (American Standard Version)</option>
          <option value="kjv">KJV (King James Version)</option>
          <option value="cut">
            CUT (Chinese Union Trandition 繁體中文和合本)
          </option>
        </Select>
        <Button
          onClick={handleSearchPassage}
          disabled={_.isEmpty(form.keyword)}
        >
          <IconMagic fill="white" width="16" height="16" />
        </Button>
      </Filter>
      <Textarea
        control
        style={{ boxSizing: "border-box", height: "500px" }}
        size="lg"
        value={form.message}
        onChange={handleChange("message")}
      />
      <div>
        <Button
          type="button"
          disabled={_.isEmpty(form.keyword) || _.isEmpty(form.message)}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  padding: 10px;
`;
const Filter = styled.div`
  margin-bottom: 10px;
  * {
    margin-right: 4px;
  }
`;
const SearchInput = styled(Input)`
  width: 250px;
`;

export { Form };
