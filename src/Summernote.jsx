/* global $ */
import React, { useRef, useEffect } from 'react';
import 'summernote/dist/summernote';
import 'summernote/dist/summernote.css';

import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/tooltip';
import 'bootstrap/dist/css/bootstrap.css';

import './quotation';
import './imageLink';
import './ndash';
import './cleaner';


const ReactSummernote = ({ 
  options, 
  extend = {},
  initialValue = '',
  onInit = () => {},
  onChange = () => {},
  //onBlur = () => {}
}) => {

  const ref = useRef(null);

  useEffect(() => {

    Object.entries(extend).forEach(key => $.extend(true, $.summernote[key[0]], key[1]));

    $(ref.current).summernote({
      ...options,
      callbacks: {
        onInit: function () {
          console.log('Summernote WYSIWYG is launched');
        },
        onDialogShown: (e, f, g) => {
          $('button.close').on('click', function () {
            $('.modal').modal('hide');
          });
        },
        onInit: function(content, $editable) {
          $(ref.current).summernote('code', initialValue);
          onInit(content, $editable);
        },
        onChange: (content, $editable) => {
          onChange(content, $editable);
        },
        //todo: bind other callbacks
        /*onBlur: (content, $editable) => {
          onBlur(content, $editable);
        },*/
      },
    });

    return () => {
      $(ref.current).summernote('destroy');
    };


  }, [
    extend
  ]);


  return (
    <div ref={ref} />
  );
};

export default ReactSummernote;

