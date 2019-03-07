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
  const regExps = [
    /^(.+)\s*(\d+):([^)]+)$/, // Matt 5:1, Matt 5:1-13, Matt5:1
    /^(\d+ \s+) (\d+):([^)]+)$/, // 1 Corinthians 5:1-13
    /^(.+) (\d+)$/, // Matt 5
    /^([^\s]+)[^\d]*(\d+)[^(]*\(([^)]+)\)$/, // Matt 5 (1-13)
    /^([^\s]+)[^\d]*(\d+)$/ // Matt 5
  ];

  let matches;
  regExps.some(regExp => {
    matches = keyword.match(regExp);
    return !!matches;
  });

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
