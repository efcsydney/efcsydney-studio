import _ from "lodash";
import books from "./books.json";

/**
 * Generate API URL according to provided bible version and keyword
 *
 * @method getAPIUrl
 * @param {string} version Bible version (e.g. NIV)
 * @param {string} keyword Passage keyword (e.g. 1 Cor 1:1-15)
 * @return {string} The API URL
 */
export const getAPIUrl = (version, keyword) => {
  const API_URL = "http://ibibles.net/quote.php";
  if (!version || !keyword) {
    return false;
  }

  let { book, chapter, range } = parseKeyword(keyword);
  book = book.toLowerCase().replace(/\s+/, "");
  range = !_.isUndefined(range)
    ? `${chapter}:${range}`
    : `${chapter}:1-${parseInt(chapter, 10) + 1}:0`; // Hack to get whole chapter
  return `${API_URL}?${version}-${book}/${range}`;
};

/**
 * Get the Bible book name from provided abbreviation.
 *
 * getBookName('Mat') // Matthew
 *
 * @method getBookName
 * @param {string} abbr The Bible book abbreviation
 * @returns {boolean|string} The Bible book name. False if nothing is matched
 */
export const getBookName = (abbr = "") => {
  console.log(abbr);
  const book = _.find(books, book => {
    const regExp = /\s+/gi;
    abbr = abbr.replace(regExp, "").toLowerCase();
    const aliases = book.aliases.map(a => a.toLowerCase().replace(regExp, ""));
    console.log(abbr, aliases.join(", "));
    return (
      book.name.toLowerCase().indexOf(abbr) !== -1 ||
      aliases.some(alias => alias.indexOf(abbr) !== -1)
    );
  });
  if (!book) return false;

  return book.name;
};

/**
 * Parse the provided keyword into {book, capter, range} object.
 *
 * parseKeyword('1 Cor 1:1-15') // {book: '1 Cor', chapter: '1', range: '1-15'}
 *
 * @method parseKeyword
 * @param {string} keyword The passage query keyword
 * @returns {boolean} false if nothing is matched
 * @returns {object}
 * @returns {string} returns.book
 * @returns {string} returns.chapter
 * @returns {string} returns.range
 */
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
    matches = keyword.trim().match(regExp);
    return !!matches;
  });

  if (!matches) {
    return false;
  }

  return {
    book: matches[1],
    chapter: matches[2],
    range: matches[3]
  };
};

/**
 * Convert HTML to verse array
 *
 * @method formatVerse
 * @param {string} html
 * @returns {boolean} false if it doesn't match anything
 * @returns {object}
 * @returns {string} returns.number The verse number
 * @returns {string} returns.message The verse message
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
