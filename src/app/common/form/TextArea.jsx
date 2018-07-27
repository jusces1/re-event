import React from 'react'
import {Form, Label} from 'semantic-ui-react'
const TextArea = ({input, width,  rows, type, placeholder, meta: {touched, error}}) => {
  return (
    <Form.Field  error={touched && !!error}  widht={width}>
        <textarea {...input} placeholder={placeholder} rows={rows}></textarea>
        {touched && error && <Label basic color='red' >{error}</Label>} 
    </Form.Field>
  )
}

export default TextArea
