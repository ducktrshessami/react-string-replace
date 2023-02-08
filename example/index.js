import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import reactStringReplace from 'react-string-replace';

const Demo = React.createClass({
  propTypes: {
    content: PropTypes.string.isRequired,
  },

  /**
   * NOTE: In many React examples you will see the `i` or `index` variable used
   * as the key for JSX tags (such as the `<a>` tags in this example), however
   * in this case we are iterating in three separate loops. This menas that we
   * cannot use `key={i}` because all three JSX tags could get the same key.
   */
  render() {
    const text = 'Hey @ian_sinn, check out this link https://github.com/iansinnott/ Hope to see you at #reactconf';
    let replacedText;

    // Match URLs
    replacedText = reactStringReplace(text, /https?:\/\/\S+/g, (match, i) => (
      <a key={match[0] + i} href={match[0]}>{match[0]}</a>
    ));

    // Match @-mentions
    replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
      <a key={match[1] + i} href={`https://twitter.com/${match[1]}`}>@{match[1]}</a>
    ));

    // Match hashtags
    replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
      <a key={match[1] + i} href={`https://twitter.com/hashtag/${match[1]}`}>#{match[1]}</a>
    ));

    return (
      <div>
        <h1>React String Replace Demo</h1>
        {replacedText}
      </div>
    );
  },
});

const content = 'Hey my number is 555-555-5555.';

// Render the app
render(<Demo content={content} />, document.getElementById('root'));
