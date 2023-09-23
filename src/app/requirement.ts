import {Story} from "./story";

export interface Requirement {
  id : number
  name: string
  description: string
  isSuccessfullyTested: boolean
  storyName: string
}
