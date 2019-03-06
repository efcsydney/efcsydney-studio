import _ from "lodash";
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

const Store = window.require("electron-store");
function useForm(data) {
  const initialState = { version: "niv", keyword: "", message: "", ...data };
  const didMountRef = useRef(false);

  const [query, setQuery] = useState({ ...initialState });
  const [form, setForm] = useState({ ...initialState });
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

  return { form, query, setForm, setQuery };
}

function Edit(props) {
  const { form, query, setForm, setQuery } = useForm();

  const willSave = useRef(false);
  useEffect(() => {
    if (!willSave.current) {
      return;
    }

    const store = new Store();
    const messages = store.get("messages");
    store.set("messages", [...messages, { ...form }]);

    willSave.current = false;
  }, willSave);
  const handleChange = key => e => {
    setForm({ ...form, [key]: e.target.value });
  };
  const handleSave = e => {
    e.preventDefault();
    e.stopPropagation();
    willSave.current = true;
    const store = new Store();
    const messages = store.get("messages") || [];
    store.set("messages", [...messages, { ...form }]);
    console.log(store.get("messages"));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setQuery({ ...form });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant="h1">Edit</Typography>
      <Filter>
        <SearchInput
          value={form.keyword}
          placeholder="Enter passage (e.g. Mat 5:3-12)"
          autoFocus
          onChange={handleChange("keyword")}
        />
        <Select value={form.version} onChange={handleChange("version")}>
          <option value="niv">NIV (New International Version)</option>
          <option value="asv">ASV (American Standard Version)</option>
          <option value="kjv">KJV (King James Version)</option>
          <option value="cut">
            CUT (Chinese Union Trandition 繁體中文和合本)
          </option>
        </Select>
        <Button type="submit" disabled={_.isEqual(form, query)}>
          Search
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
  width: 250px;
`;

export { Edit };
