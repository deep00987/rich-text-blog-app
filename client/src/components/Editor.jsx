import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/monokai-sublime.css'; 

// // Load the programming language syntax highlighting libraries you need
// import javascript from 'highlight.js/lib/languages/javascript';
// import css from 'highlight.js/lib/languages/css';
// import xml from 'highlight.js/lib/languages/xml'; // For HTML and XML code highlighting

// hljs.registerLanguage('javascript', javascript);
// hljs.registerLanguage('css', css);
// hljs.registerLanguage('xml', xml);

const QuillEditor = () => {
  const [body, setBody] = useState('');

  const handleQuillChange = (value) => {
    setBody(value);
  };

  const modules = {
    // Your other Quill modules if any
    syntax: {
      highlight: (text) => hljs.highlightAuto(text).value,
    },
  };

  return (
    <ReactQuill
      className="editor"
      theme="snow"
      id="body"
      name="body"
      value={body}
      // onChange={handleQuillChange}
      modules={modules}
    />
  );
};

export default QuillEditor;
