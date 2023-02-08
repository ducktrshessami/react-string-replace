# React String Replace

A simple way to safely do string replacement with React components. Zero dependencies.

> Aka turn a string into an array of React components

Forked to allow the replacer function to utilize a raw match result array as returned from `RegExp#exec`

## Install

```sh
yarn add react-string-replace
```


## Usage

First, import the lib. Both `require` and `import` are supported.

```js
import reactStringReplace from 'react-string-replace';
// OR
const reactStringReplace = require('react-string-replace')
```

Examples will use `import` since it is more common in the React ecosystem.

### Simple Example

```js
import reactStringReplace from 'react-string-replace';

reactStringReplace('whats your name', 'your', (match, i) => (
  <span>{match[0]}</span>
));
// => [ 'whats ', <span>your</span>, ' name' ]
```

### More realistic example

Highlight all digits within a string by surrounding them in span tags:

```js
reactStringReplace('Apt 111, phone number 5555555555.', /\d+/g, (match, i) => (
  <span key={i} style={{ color: 'red' }}>{match[0]}</span>
));
// =>
// [
//   'Apt ',
//   <span style={{ color: 'red' }}>111</span>,
//   ', phone number ',
//   <span style={{ color: 'red' }}>5555555555</span>,
//   '.'
// ]
```

### Within a React component

```js
import reactStringReplace from 'react-string-replace';

const HighlightNumbers = React.createClass({
  render() {
    const content = 'Hey my number is 555-555-5555.';
    return (
      <div>
        {reactStringReplace(content, /\d+/g, (match, i) => (
          <span key={i} style={{ color: 'red' }}>{match[0]}</span>
        ))}
      </div>
    );
  },
});
```

### Multiple replacements on a single string

You can run multiple replacements on one string by calling the function multiple times on the returned result. For instance, if we want to match URLs, @-mentions and hashtags in a string we could do the following:

```js
import reactStringReplace from 'react-string-replace';

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

// => [
//   'Hey ',
//   <a href='https://twitter.com/ian_sinn'>@ian_sinn</a>
//   ', check out this link ',
//   <a href='https://github.com/iansinnott/'>https://github.com/iansinnott/</a>,
//   '. Hope to see you at ',
//   <a href='https://twitter.com/hashtag/reactconf'>#reactconf</a>
// ];
```

### Full Example

See the [`example/`](https://github.com/iansinnott/react-string-replace/tree/master/example) directory for a runnable example.

## Why?

I wanted an easy way to do string replacement similar to `String.prototype.replace` within React components **without** breaking React's built in string escaping and XSS protection. This meant standard string replacement combined with `dangerouslySetInnerHTML` was out of the question.

## API

### reactStringReplace(string, match, replacementFunction)

#### string

Type: `string|array`

The string or array you would like to do replacement on.

**NOTE:** When passed an array this is the same as running the replacement on every string within the array. Any non-string values in the array will be left untouched.

#### match

Type: `regexp|string`

The string or RegExp you would like to replace within `string`. 

**NOTE:** When using a `RegExp`, flags will be coerced to include `g` and exclude `y`.

Example: Replace all occurrences of `'hey'` with `<span>hey</span>`

```js
reactStringReplace('hey hey you', /hey/g, () => <span>hey</span>);
```

#### replacementFunction

Type: `function`

The replacer function to run each time `match` is found. This function will be passed the matched result array (as returned from `RegExp#exec`) and an `index` which can be used for adding keys to replacement components if necessary.

```js
const replacementFunction = (match, index, offset) => <span key={index}>{match}</span>;
reactStringReplace('hey hey you', /hey/g, replacementFunction);
```

## API Stability

With v1.0.0 the API is considered stable and should be considered production ready. Pull requests are still welcome but there is currently no intent to make changes to this lib other than bug fixes (please submit an issue if you find something!).

For details on API tests see [the tests file](./test.js).

## License

MIT © [Ian Sinnott](https://github.com/iansinnott)

MIT © [ducktrshessami](https://github.com/ducktrshessami)
