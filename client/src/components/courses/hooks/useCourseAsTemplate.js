
import React, { useEffect } from 'react';

const removeTypename = object => {
    const newObject = { ...object };
    // eslint-disable-next-line no-underscore-dangle
    delete newObject.__typename;
    return newObject;
};

export const useCourseAsTemplate = (called, loading, data, setQuestions, setValue) => {

    console.log(data)
    useEffect(() => {
        if (called && !loading) {
            const result = data.getCourseByCode;
            console.log(data.getCourseByCode);
            setValue("courseTitle", result[0].title)
            setValue("courseDescription", result[0].description)
            if (result[0].questions) {
                const qstns = result[0].questions
                    .map(q => {
                        const newQ = removeTypename(q);
                        newQ.questionChoices = q.questionChoices.map(qc => removeTypename(qc));
                        return newQ;
                    });

                console.log(qstns)
                setQuestions(qstns);
            }
        }
    }, [called])
}

