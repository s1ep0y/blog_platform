import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Form, Input, Button, Tag } from 'antd';
import { uniqueId } from 'lodash';
import FormMessage from './FormMessage';

const ArticleForm = (props) => {
  const { action, initialValues, validationSchema, tags, errors, page, status } = props;

  const [tagList, setTags] = useState(tags);
  const [form] = Form.useForm();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async (values) => {
      const articleToSend = {
        ...values,
        tagList,
      };
      action(articleToSend);
    },
  });

  const addTagToList = (event) => {
    event.preventDefault();
    if (formik.values.tag.length === 0) {
      return;
    }
    setTags([...tagList, formik.values.tag]);
    formik.setFieldValue('tag', '');
    form.setFieldsValue({ tag: '' });
  };

  const removeTagFromList = (val) => (event) => {
    event.preventDefault();
    setTags(tagList.filter((elem) => elem !== val));
  };

  const requiredClass = page === 'edit' ? null : 'required';

  return (
    <div className="wrapper">
      <Form
        onFinish={formik.handleSubmit}
        initialValues={initialValues}
        form={form}
        className="article_form"
      >
        <Form.Item
          name="title"
          label="Title"
          className={requiredClass}
          validateStatus={formik.errors.title && formik.touched.title ? 'error' : 'success'}
          help={formik.errors.title && formik.touched.title ? formik.errors.title : null}
        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          className={requiredClass}
          validateStatus={
            formik.errors.description && formik.touched.description ? 'error' : 'success'
          }
          help={
            formik.errors.description && formik.touched.description
              ? formik.errors.description
              : null
          }
        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          name="body"
          label="Article text"
          className={requiredClass}
          validateStatus={formik.errors.body && formik.touched.body ? 'error' : 'success'}
          help={formik.errors.body && formik.touched.body ? formik.errors.body : null}
        >
          <Input.TextArea onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>

        <Form.Item label="Add tag" name="tag" style={{ marginBottom: '8px' }}>
          <Input
            allowClear="allowClear"
            value={formik.values.tag}
            onChange={formik.handleChange}
            onPressEnter={addTagToList}
          />
        </Form.Item>
        <Form.Item>
          <div className="article_form__tagList">
            {tagList.map((text) => (
              <Tag key={uniqueId()} closable="closable" onClose={removeTagFromList(text)}>
                {text}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {page === 'edit' ? 'Save Changes' : 'Post Article'}
          </Button>
        </Form.Item>
      </Form>
      {FormMessage(status, errors)}
    </div>
  );
};

ArticleForm.defaultProps = {
  action: () => {},
  initialValues: {},
  validationSchema: {},
  tags: [],
  errors: {},
  page: '',
  status: '',
};

ArticleForm.propTypes = {
  action: PropTypes.func,
  initialValues: PropTypes.objectOf(PropTypes.any),
  validationSchema: PropTypes.objectOf(PropTypes.any),
  tags: PropTypes.arrayOf(PropTypes.any),
  errors: PropTypes.objectOf(PropTypes.any),
  page: PropTypes.string,
  status: PropTypes.string,
};

export default ArticleForm;
