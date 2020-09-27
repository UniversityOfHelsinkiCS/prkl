import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Segment } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';

const QuestionForm = ({ questionId, setQuestions, questions }) => {
  const intl = useIntl();

  const defaultQuestion = {
    questionType: 'singleChoice',
    content: '',
    order: questionId
  }

  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState(defaultQuestion);

  useEffect(() => {
    const qstn = questions[questionId]
      ? {
        questionType: questions[questionId].questionType
          ? questions[questionId].questionType 
          : defaultQuestion.questionType,
        content: questions[questionId].content,
        order: questionId
      }
      : defaultQuestion;
    setQuestion(qstn);
    const opts = questions[questionId]?.questionChoices 
      ? questions[questionId].questionChoices.map(qc => {
        return {
          content: qc.content,
          order: qc.order
        }
      })
      : options;
    setOptions(opts);
  }, []);

  const handleOptionChange = index => (e, { value }) => {
    const newOptions = options;
    newOptions[index] = { ...newOptions[index], content: value };
    setOptions(newOptions);

    const questionObject = {
      ...question,
      questionChoices: newOptions,
    };
    const newQuestions = [...questions];

    newQuestions[questionId] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleTypeChange = value => {
    const questionObject = { ...question, questionType: value };
    if (value === 'freeForm') {
      delete questionObject.questionChoices;
    }

    const newQuestions = [...questions];
    newQuestions[questionId] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleTitleChange = (e, { value }) => {
    const questionObject = { ...question, content: value };
    const newQuestions = [...questions];
    newQuestions[questionId] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleAddForm = () => {
    setOptions([...options, { order: options.length + 1, content: '' }]);
  };
  const handleRemoveForm = () => {
    setOptions(options.slice(0, options.length - 1));
  };

  return (
    <Segment style={{ padding: 15, margin: 10 }}>
      <Form.Field
        required
        onChange={handleTitleChange}
        control={Input}
        value={question.content}
        label={intl.formatMessage({
          id: 'questionForm.title',
        })}
        placeholder={intl.formatMessage({
          id: 'questionForm.titlePlaceholder',
        })}
      />
      <Form.Group inline>
        <label>
          <FormattedMessage id="questionForm.questionTypeLabel" />
        </label>
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: 'questionForm.numericalQuestion',
          })}
          value="singleChoice"
          checked={question.questionType === 'singleChoice'}
          onChange={() => handleTypeChange('singleChoice')}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: 'questionForm.multipleSelectOne',
          })}
          value="multipleChoice"
          checked={question.questionType === 'multipleChoice'}
          onChange={() => handleTypeChange('multipleChoice')}
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: 'questionForm.freeformQuestion',
          })}
          value="freeForm"
          checked={question.questionType === 'freeForm'}
          onChange={() => handleTypeChange('freeForm')}
        />
      </Form.Group>
      {question.questionType !== 'freeForm' ? (
        <>
          <Form.Group>
            <Form.Button type="button" onClick={handleAddForm} color="green">
              <FormattedMessage id="questionForm.addQuestion" />
            </Form.Button>

            <Form.Button type="button" onClick={handleRemoveForm} color="red">
              <FormattedMessage id="questionForm.removeQuestion" />
            </Form.Button>
          </Form.Group>

          <Form.Group style={{ flexWrap: 'wrap' }}>
            {options.map((q, index) => (
              <Form.Field
                onChange={handleOptionChange(index)}
                control={Input}
                type="text"
                value={q.content}
                label={intl.formatMessage(
                  {
                    id: 'questionForm.optionTitle',
                  },
                  {
                    number: index + 1,
                  }
                )}
                key={`question${questionId}optionsForm${index}`}
                placeholder={intl.formatMessage(
                  {
                    id: 'questionForm.optionTitle',
                  },
                  {
                    number: index + 1,
                  }
                )}
              />
            ))}
          </Form.Group>
        </>
      ) : null}
    </Segment>
  );
};

export default QuestionForm;
