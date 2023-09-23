import {Story} from "./story";

export interface Requirement {
  id : number
  name: string
  description: string
  storyName: string
  isSuccessfullyTested: boolean
  isBuilt : boolean
}
