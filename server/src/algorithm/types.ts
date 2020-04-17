import { GroupInput } from "../inputs/GroupInput";

export interface SimplifiedTime {
  start: number;
  diff: number;
  day: number;
  tentative: boolean;
}

interface AnswerChoiceObject {
  type: string;
  totalChoices: number;
  selected: number[];
}

export interface QuestionsMap {
  [key: string]: AnswerChoiceObject[];
}

export interface AllTimes {
  [key: string]: SimplifiedTime[];
}

export interface MaxAvailableTimes {
  [key: string]: number;
}

export interface DividedGroup {
  groups: GroupInput[];
  score: number;
}
