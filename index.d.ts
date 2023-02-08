declare module 'react-string-replace' {
  function reactStringReplace(
    text?: string | React.ReactNode[], 
    regex?: string | RegExp, 
    cb?: (match: RegExpExecArray, index: number) => React.ReactNode | React.ReactNode[]
  ): React.ReactNode[];

  export default reactStringReplace;
}
