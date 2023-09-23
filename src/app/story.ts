import {Scenario} from "./scenario";
import {Requirement} from "./requirement";

export interface Story {
  id : number
  name: string
  description: string
  scenariosName: string[] | null
  requirementNames: string[] | null
  isAllRequirementsSuccessfullyTested : boolean
}
