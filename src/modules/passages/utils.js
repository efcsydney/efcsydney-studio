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
 * Get the formal Bible book name by provided string, which is usually an abbreviation.
 *
 * getBookName('Mat') // Matthew
 *
 * @method getBookName
 * @param {string} name The Bible book abbreviation
 * @returns {boolean|string} The Bible book name. False if nothing is matched
 */
export const getBookName = (name = "") => {
  const normalize = str => str.replace(/\s+/g, "").toLowerCase(); // Remove all spaces
  name = normalize(name);
  const book = books.find(book => {
    const aliases = book.aliases.map(alias => normalize(alias));
    const bookName = normalize(book.name);
    return (
      bookName.includes(name) || aliases.some(alias => alias.includes(name))
    );
  });
  return book ? book.name : name;
};

/**
 * Parse provided keyword into {book, capter, range} object.
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
export const parseKeyword = (keyword = "") => {
  keyword = keyword.trim();
  const regExps = [
    /^(\d+\s?[^\d\s]+)\s?(\d+):(.+)$/, // 1 Cors 5:1-13, 1Cor5:1-13
    /^(\d+\s?[^\d\s]+)\s?(\d+)$/, // 1 Cor 5, 1Cor5
    /^([^\d\s]+)\s?(\d+):(.+)$/, // Matt 5:1, Matt5:1, Matt 5:1-13, Matt5:1-13, Matt5:1
    /^([^\d\s]+)\s?(\d+)$/ // Matt 5, Matt5
    // /^([^\s]+)[^\d]*(\d+)[^(]*\(([^)]+)\)$/, // Matt 5 (1-13)
    // /^([^\s]+)[^\d]*(\d+)$/ // Matt 5
  ];

  let matches;
  regExps.some(regExp => {
    matches = keyword.match(regExp);
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
 * @method mapHtmlToVerses
 * @param {string} html
 * @returns {boolean} false if it doesn't match anything
 * @returns {object[]}
 * @returns {string} returns.number The verse number
 * @returns {string} returns.message The verse message
 */
export const mapHtmlToVerses = html => {
  const regExp = /<small>(\d+):(\d+)<\/small>([^<]+)<br>/;
  const matches = html.match(new RegExp(regExp, "gm"));
  if (!matches) {
    return false;
  }
  return matches.map(html => {
    const parts = html.match(regExp);
    return {
      number: parts[2],
      message: parts[3]
    };
  });
};
