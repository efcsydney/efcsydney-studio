import _ from "lodash";

const API_URL = "http://ibibles.net/quote.php";

export const getAPIUrl = query => {
  const version = _.get(query, "version", "");
  const keyword = _.get(query, "keyword", "");
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

// Get structured data
export const formatVerse = html => {
  const matches = html.match(/<small>(\d+):(\d+)<\/small>([^<]+)<br>/gm);
  if (!matches) {
    return false;
  }
  matches.shift();
  return matches.map(html => {
    const parts = html.match(/<small>(\d+):(\d+)<\/small>([^<]+)<br>/);
    return {
      number: parts[2],
      message: parts[3]
    };
  });
};
