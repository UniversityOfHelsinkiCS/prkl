import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Segment } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';

const QuestionForm = ({ questionIndex, setQuestions, questions, hideAddRemoveButtons }) => {
  const intl = useIntl();

  const defaultQuestion = {
    questionType: 'singleChoice',
    content: '',
    order: questionIndex
  }

  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState(defaultQuestion);

  useEffect(() => {
    const qstn = questions[questionIndex]
      ? {
        id: questions[questionIndex].id,
        questionType: questions[questionIndex].questionType
          ? questions[questionIndex].questionType 
          : defaultQuestion.questionType,
        content: questions[questionIndex].content,
        questionChoices: questions[questionIndex].questionChoices,
        order: questionIndex
      }
      : defaultQuestion;
    setQuestion(qstn);
    const opts = questions[questionIndex]?.questionChoices 
      ? questions[questionIndex].questionChoices.map(qc => {
        return {
          id: qc.id,
          content: qc.content,
          order: qc.order
        }
      })
      : options;
    setOptions(opts);
  }, [questions]);

  const handleOptionChange = index => (e, { value }) => {
    const newOptions = options;
    newOptions[index] = { ...newOptions[index], content: value };
    setOptions(newOptions);

    const questionObject = {
      ...question,
      questionChoices: newOptions,
    };
    const newQuestions = [...questions];

    newQuestions[questionIndex] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleTypeChange = value => {
    const questionObject = { ...question, questionType: value };
    if (value === 'freeForm') {
      delete questionObject.questionChoices;
    }

    const newQuestions = [...questions];
    newQuestions[questionIndex] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleTitleChange = (e, { value }) => {
    const questionObject = { ...question, content: value };
    const newQuestions = [...questions];
    newQuestions[questionIndex] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleAddForm = () => {
    setOptions([...options, { order: options.length + 1, content: '' }]);
  };
  const handleRemoveForm = () => {
    const newOptions = options.slice(0, options.length - 1);
    const newQuestion = { ...question, questionChoices: newOptions };
    const newQuestions = [...questions];
    newQuestions[questionIndex] = newQuestion;
    setOptions(newOptions);
    setQuestion(newQuestion);
    setQuestions(newQuestions);
  };

  const removeQuestion = (e) => {
    e.preventDefault();
    const newQuestions = questions.filter((q, i) => {
      return i !== questionIndex;
    }).map((q, i) => {
      return i < questionIndex ? q : { ...q, order: q.order-1 }
    });
    setQuestions(newQuestions);
  }

  return (
    <Segment style={{ padding: 15, margin: 10 }}>
      {!hideAddRemoveButtons && <Form.Button  // TODO: Better styling for this button
        onClick={removeQuestion}
        floated="right"
      >X
      </Form.Button>}
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
      {!hideAddRemoveButtons && <Form.Group inline>
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
      </Form.Group>}
      {question.questionType !== 'freeForm' ? (
        <>

        {!hideAddRemoveButtons && 
          <Form.Group>
            <Form.Button type="button" onClick={handleAddForm} color="green">
              <FormattedMessage id="questionForm.addQuestion" />
            </Form.Button>

            <Form.Button type="button" onClick={handleRemoveForm} color="red">
              <FormattedMessage id="questionForm.removeQuestion" />
            </Form.Button>
          </Form.Group>
          }

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
                key={`question${questionIndex}optionsForm${index}`}
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
