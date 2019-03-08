import { useEffect, useState } from "react";
import { getAPIUrl, formatVerse } from "./utils";
import shortid from "shortid";
const Store = window.require("electron-store");

/**
 * useSearchPassage Hook
 *
 * @method useSearchPassage
 * @returns {object}
 * @returns {string} return.passage The search result
 * @returns {function} return.searchPassage The query method
 */
export function useSearchPassage() {
  const [passage, setPassage] = useState("");

  /**
   * Search passage with API
   *
   * @method searchPassage
   * @param {string} version The bible version (e.g. NIV)
   * @param {string} keyword The passage query string (e.g. Matt 5:1-15)
   * @returns {Promise} Promise object represents the searched result of passage
   */
  const searchPassage = (version, keyword) => {
    const url = getAPIUrl(version, keyword);

    return fetch(url)
      .then(response => response.text())
      .then(html => {
        const verses = formatVerse(html);

        // TODO: Need to have better error handling
        if (!verses) {
          throw new Error("No verse exist. Please try again");
        }

        const passage = verses
          .map(verse => `${verse.number} ${verse.message}`)
          .join("\n");

        setPassage(passage);

        return passage;
      });
  };

  return { passage, searchPassage };
}

/**
 * useForm Hook
 *
 * @method useForm
 * @param {object} formData The current form fields data
 * @returns {object}
 * @returns {object} returns.form The current form state
 * @returns {object} returns.setForm Update the form state
 */
export function useForm(formData) {
  const initialState = {
    version: "niv",
    keyword: "",
    message: "",
    ...formData
  };

  const [form, setForm] = useState(initialState);
  useEffect(() => {
    setForm(initialState);
  }, [formData]);

  return { form, setForm };
}

/**
 * usePassages Hook - CRUD for passages
 *
 * @method usePassages
 * @returns {object}
 * @returns {object[]} returns.passages
 * @returns {function} returns.createPassage
 * @returns {function} returns.deletePassage
 * @returns {function} returns.updatePassage
 */
export const usePassages = () => {
  const [passages, setPassages] = useState([]);
  let store = null;
  store = new Store();

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
