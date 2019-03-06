import { useEffect, useState } from "react";
import { getAPIUrl, formatVerse } from "./utils";
import shortid from "shortid";
const Store = window.require("electron-store");

export function useSearchPassage() {
  const [passage, setPassage] = useState("");

  /**
   * @param {string} query Verse query string (e.g. Matt 5:1-15)
   * @returns {Promise}
   */
  const searchPassage = (version, keyword) => {
    const url = getAPIUrl(version, keyword);

    return fetch(url)
      .then(response => response.text())
      .then(html => {
        const verses = formatVerse(html);

        if (!verses) {
          return;
        }

        const passage = verses
          .map(verse => verse.number + " " + verse.message)
          .join("\n");

        setPassage(passage);

        return passage;
      });
  };

  return { passage, searchPassage };
}

export function useForm(data) {
  const initialState = { version: "niv", keyword: "", message: "", ...data };

  const [form, setForm] = useState(initialState);
  useEffect(() => {
    setForm(initialState);
  }, [data]);

  return { form, setForm };
}

export const usePassages = () => {
  const [passages, setPassages] = useState([]);
  let store = null;
  store = new Store();

  // cDM
  useEffect(() => {
    setPassages(store.get("passages") || []);
    return () => {
      store = null;
    };
  }, []);

  const createPassage = passage => {
    passage = { id: shortid.generate(), ...passage };
    const nextPassages = [...passages, passage];
    store.set("passages", nextPassages);
    setPassages(nextPassages);
    return passage;
  };

  const deletePassage = id => {
    const nextPassages = passages.filter(p => p.id !== id);
    store.set("passages", nextPassages);
    setPassages(nextPassages);
    return true;
  };

  const updatePassage = (id, passage) => {
    const nextPassages = passages.map(p => (p.id === id ? passage : p));
    store.set("passages", nextPassages);
    setPassages(nextPassages);
    return passage;
  };

  return {
    passages,
    createPassage,
    deletePassage,
    updatePassage
  };
};
