import {Requirement} from "./requirement";
import {Story} from "./story";

export interface Scenario {
  id : number
  name: string
  description: string
  requirementNames: string[] | null
  storyName : string
  storyId : number
  isSuccessfullyTested: boolean
}
