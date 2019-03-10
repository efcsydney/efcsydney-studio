import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { Button, Input, Select, Textarea } from "@smooth-ui/core-sc";
import { useForm, useSearchPassage } from "./hooks";
import { getBookName, parseKeyword } from "./utils";
import { ReactComponent as IconMagic } from "../../svgs/magic-wand.svg";
import { withRouter, Link } from "react-router-dom";

const Form = withRouter(({ data, type, history, onSave }) => {
  const { form, setForm } = useForm(data);
  const { searchPassage } = useSearchPassage();

  const handleChange = key => e => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();

    onSave(form);
    if (type === "edit") {
      history.push(`/passages/show/${data.id}`);
    } else {
      history.push("/passages");
    }
  };

  const handleSearchPassage = e => {
    e.preventDefault();
    const result = parseKeyword(form.keyword);
    if (!result) {
      alert(
        `Oops, something goes wrong. Please modify the keyword and try again.`
      );
      return;
    }
    searchPassage(form.version, form.keyword)
      .then(passage => {
        let { book, chapter, range } = result;
        book = getBookName(book);
        range = range ? `:${range}` : "";
        const keyword = `${book} ${chapter}${range}`.trim();
        setForm({ ...form, message: passage, keyword });
      })
      .catch(e => alert(e.message));
  };

  return (
    <Wrapper onSubmit={handleSave}>
      <Filter>
        <Select
          value={form.version}
          onChange={handleChange("version")}
          style={{ fontSize: "12px", marginBottom: "10px" }}
        >
          <option value="niv">NIV (New International Version)</option>
          <option value="asv">ASV (American Standard Version)</option>
          <option value="kjv">KJV (King James Version)</option>
          <option value="cut">
            CUT (Chinese Union Trandition 繁體中文和合本)
          </option>
        </Select>
        <Header>
          <SearchInput
            value={form.keyword}
            placeholder="Enter passage (e.g. Mat 5:3-12)"
            autoFocus
            onChange={handleChange("keyword")}
          />
          <AutoButton
            onClick={handleSearchPassage}
            disabled={_.isEmpty(form.keyword)}
          >
            <IconMagic fill="white" width="16" height="16" />
          </AutoButton>
        </Header>
      </Filter>
      <Textarea
        control
        style={{ fontSize: "36px", boxSizing: "border-box", height: "500px" }}
        size="lg"
        value={form.message}
        onChange={handleChange("message")}
      />
      <ButtonRow>
        <Button
          type="button"
          disabled={_.isEmpty(form.keyword) || _.isEmpty(form.message)}
          onClick={handleSave}
        >
          Save
        </Button>
        <Link to="/passages">Cancel</Link>
      </ButtonRow>
    </Wrapper>
  );
});

const Wrapper = styled.form`
  padding: 10px;
  text-align: center;
`;
const ButtonRow = styled.div`
  padding: 10px 0;
  * {
    margin-right: 5px;
  }
`;
const Header = styled.header`
  position: relative;
`;
const Filter = styled.div`
  margin-bottom: 10px;
  * {
    margin-right: 4px;
  }
`;
const AutoButton = styled(Button)`
  position: absolute;
  top: calc(50% - 18px);
  right: 10px;
`;
const SearchInput = styled(Input)`
  display: block;
  font-size: 2.5rem;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
`;

export { Form };
