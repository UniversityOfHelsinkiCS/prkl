# Algorithm (developed spring 2021)

### Evaluators
Algorithm uses two different evaluators, evaluate by multiple/single choice questions and evaluate by common working hours.
Both of the evaluators compare all the possible combinations of two students within one group and returns a number between 0 and 1 as a result.
After all the combinations have been evaluated, results are summed up as a groups total score.

[Question-choice-evaluator](server/src/algorithm/evaluators/evaluateByMultipleChoice.ts)

[Working-hours-evaluator](server/src/algorithm/evaluators/evaluateByWorkingHours.ts)

[Combined evaluating](server/src/algorithm/evaluators/bothEvaluators.ts)

### Algorithm

Same algorithm is used in generating completely new groups, finding a group for groupless student(s) or creating new groups without including locked groups.

1. Algorithm creates random groups and calculates every groups score using evaluators and then sums up total score from all the groups and saves the result as current grouping.

2. Two randomly picked students swap groups from two randomly selected groups and then the score is being evaluated again. After evaluation the results are compared to current grouping. If the result is higher than current groupings, current grouping gets overwritten with the new one.

3. Repeat step 2 for n iterations and return groups with the best result.

### Previous versions

At least three versions of the algorithm have been developed in the previous iterations. 

Said versions can be found in the commit history (eg. [here](https://github.com/UniversityOfHelsinkiCS/prkl/tree/274c2321ac988f77815b0f58364389df192d8436/server/src/algorithm))

#### server/src/algorithm

First one consists of the combined action of `types.ts`, `evaluate.ts` and `index.ts`. For more specific description, see [documentation](oldalgorithm.md).

Second one is `new_algo.ts`

#### data/

Third one was made with Python, `python_algo.py`
