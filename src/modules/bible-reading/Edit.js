import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Input,
  Select,
  Textarea,
  Typography
} from "@smooth-ui/core-sc";
import { getAPIUrl, formatVerse } from "./utils";

function Edit(props) {
  const initialState = { version: "niv", keyword: "", message: "" };
  const didMountRef = useRef(false);

  const [form, setForm] = useState(initialState);
  const handleChange = key => e => {
    setForm({ ...form, [key]: e.target.value });
  };

  const [query, setQuery] = useState(initialState);
  const handleSubmit = e => {
    e.preventDefault();
    setQuery({ ...form });
  };
  useEffect(() => {
    const url = getAPIUrl(query);
    if (didMountRef.current) {
      fetch(url)
        .then(response => response.text())
        .then(html => {
          const verses = formatVerse(html);
          if (verses) {
            const message = verses
              .map(verse => verse.number + " " + verse.message)
              .join("\n");
            setForm({ ...form, message });
          }
        });
    } else {
      didMountRef.current = true;
    }
  }, [query]);

  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant="h1">Edit</Typography>
      <Filter>
        <Select value={form.version} onChange={handleChange("version")}>
          <option value="niv">NIV (New International Version)</option>
          <option value="asv">ASV (American Standard Version)</option>
          <option value="kjv">KJV (King James Version)</option>
          <option value="cut">
            CUT (Chinese Union Trandition 繁體中文和合本)
          </option>
        </Select>
        <SearchInput
          value={form.keyword}
          placeholder="e.g. Mat 5:3-12"
          onChange={handleChange("keyword")}
        />
        <Button type="submit">Search</Button>
      </Filter>
      <Textarea
        control
        style={{ boxSizing: "border-box", height: "500px" }}
        size="lg"
        value={form.message}
        onChange={handleChange("message")}
      />
      <div>
        <Button type="button">Save</Button>
      </div>
    </Form>
  );
}

const Form = styled.form`
  padding: 10px;
`;
const Filter = styled.div`
  margin-bottom: 10px;
  * {
    margin-right: 4px;
  }
`;
const SearchInput = styled(Input)`
  border-radius: 20px;
  border: solid 1px #ccc;
  display: inline-block;
  outline: 0;
  padding: 8px;
  width: 250px;
`;

export { Edit };
