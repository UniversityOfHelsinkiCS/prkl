import React, { useEffect, useState } from 'react';
import { Form, Input, Message, Radio, Segment } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';

const QuestionForm = ({ qName, questionIndex, setQuestions, questions, hideAddRemoveButtons, hookForm }) => {
  const intl = useIntl();

  const defaultQuestion = {
    questionType: 'singleChoice',
    content: '',
    order: questionIndex,
    qKey: qName
  }

  const [questionType, setQuesitonType] = useState('singleChoice');
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState(defaultQuestion);
  const [init, setInit] = useState(true);

  const { setValue, trigger, errors, setError, clearErrors, register, unregister } = hookForm;

  const missingChoicesErr = 'choice-' + qName;

  useEffect(() => {
    register({ name: qName }, { required: 'Question title required' });
    if (questionType !== 'freeForm' && !options.length) {
      setError(missingChoicesErr, {message: 'At least one answer option required'});
    } else {
      clearErrors(missingChoicesErr);
    }
  }, [options]);

  useEffect(() => {
    const qstn = questions[questionIndex]
      ? {
        id: questions[questionIndex].id,
        questionType: questions[questionIndex].questionType
          ? questions[questionIndex].questionType 
          : defaultQuestion.questionType,
        content: questions[questionIndex].content,
        questionChoices: questions[questionIndex].questionChoices,
        order: questionIndex,
        qKey: qName
      }
      : defaultQuestion;
    setQuestion(qstn);
    if (init) {
      setQuestions(questions.map(q => q.qKey !== question.qKey ? q : question));
      setInit(false);
    }
    const opts = questions[questionIndex]?.questionChoices 
      ? questions[questionIndex].questionChoices.map(qc => {
        // Something is bugged with this oName thing, removing all text from single choice in a question will mark all choice fields of that question erroneous
        const oName = qc.oName ? qc.oName : 'question-' + qName + '-o-' + new Date().getTime().toString();
        if (!qc.oName) register({name: oName}, {required: 'Choice text required'});
        return {
          id: qc.id,
          content: qc.content,
          order: qc.order,
          oName: oName
        }
      })
      : options;
    setOptions(opts);
  }, [questions]);

  const handleOptionChange = (e, index, value) => {
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
      options.forEach(o => unregister(o.oName));
      setOptions([]);
    }
    setQuesitonType(value);

    const newQuestions = [...questions];
    newQuestions[questionIndex] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleTitleChange = (e, value) => {
    const questionObject = { ...question, content: value };
    const newQuestions = [...questions];
    newQuestions[questionIndex] = questionObject;
    setQuestion(questionObject);
    setQuestions(newQuestions);
  };

  const handleAddForm = () => {
    const oName = 'question-' + qName + '-o-' + new Date().getTime().toString();
    register({name: oName}, {required: 'Choice text required'});
    setOptions([...options, { oName: oName, order: options.length + 1, content: '' }]);
  };

  const handleRemoveForm = () => {
    if (options) unregister(options[options.length-1].oName);
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
    unregister(qName);
    options.forEach(o => unregister(o.oName));
    clearErrors(missingChoicesErr);
    setOptions([]);
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
        data-cy="question-remove-button"
      >X
      </Form.Button>}
      <Form.Field
        name={qName}
        onChange={async (e, {name, value}) => {
          handleTitleChange(e, value);
          setValue(name, value);
          await trigger(name);
        }}
        error={errors[qName]?.message}
        control={Input}
        value={question.content}
        label={intl.formatMessage({
          id: 'questionForm.title',
        })}
        placeholder={intl.formatMessage({
          id: 'questionForm.titlePlaceholder',
        })}
        data-cy="question-title"
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
          data-cy="question-type-single"
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: 'questionForm.multipleSelectOne',
          })}
          value="multipleChoice"
          checked={question.questionType === 'multipleChoice'}
          onChange={() => handleTypeChange('multipleChoice')}
          data-cy="question-type-multi"
        />
        <Form.Field
          control={Radio}
          label={intl.formatMessage({
            id: 'questionForm.freeformQuestion',
          })}
          value="freeForm"
          checked={question.questionType === 'freeForm'}
          onChange={() => handleTypeChange('freeForm')}
          data-cy="question-type-freeform"
        />
      </Form.Group>}
      {question.questionType !== 'freeForm' ? (
        <>

        {!hideAddRemoveButtons && 
          <Form.Group>
            <Form.Button type="button" onClick={handleAddForm} color="green" data-cy="add-question-choice-button">
              <FormattedMessage id="questionForm.addQuestion" />
            </Form.Button>

            <Form.Button type="button" onClick={handleRemoveForm} color="red" data-cy="remove-question-choice-button">
              <FormattedMessage id="questionForm.removeQuestion" />
            </Form.Button>
          </Form.Group>
          }

          {errors[missingChoicesErr] &&
          <Message
            negative
            header={errors[missingChoicesErr]?.message}
          />}
          <Form.Group style={{ flexWrap: 'wrap' }}>
            {options.map((q, index) => (
              <Form.Field
                name={q.oName}
                onChange={async (e, {name, value}) => {
                  handleOptionChange(e, index, value);
                  setValue(name, value);
                  await trigger(name);
                }}
                error={errors[q.oName]?.message}
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
                data-cy={`question-${questionIndex}-choice-${index}`}
              />
            ))}
          </Form.Group>
        </>
      ) : null}
    </Segment>
  );
};

export default QuestionForm;
