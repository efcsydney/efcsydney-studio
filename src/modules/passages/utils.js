import _ from "lodash";
import books from "./books.json";

const API_URL = "http://ibibles.net/quote.php";

export const getAPIUrl = (version, keyword) => {
  if (!version || !keyword) {
    return false;
  }
  const queryString =
    version +
    "-" +
    keyword
      .toLowerCase()
      .trim()
      .replace(" ", "/");
  return `${API_URL}?${queryString}`;
};

export const getBookName = abbr => {
  const book = _.find(books, book => {
    const regExp = /\s+/g;
    abbr = abbr.replace(regExp, "");
    const aliases = book.aliases.map(a => a.replace(regExp, ""));
    return abbr === book.name || _.includes(aliases, abbr);
  });
  if (!book) return false;

  return book.name;
};

export const parseKeyword = keyword => {
  const regExp = /^(.+) (\d+):([\d]+-[\d]+)$/;
  const matches = keyword.match(regExp);
  if (!matches) return false;
  return {
    book: matches[1],
    chapter: matches[2],
    range: matches[3]
  };
};

/**
 * Convert HTML to verse array
 *
 * @param {string} html
 * @returns {object}
 */
export const formatVerse = html => {
  const matches = html.match(/<small>(\d+):(\d+)<\/small>([^<]+)<br>/gm);
  if (!matches) {
    return false;
  }
  return matches.map(html => {
    const parts = html.match(/<small>(\d+):(\d+)<\/small>([^<]+)<br>/);
    return {
      number: parts[2],
      message: parts[3]
    };
  });
};
