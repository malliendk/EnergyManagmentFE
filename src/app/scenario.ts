export interface Scenario {
  id : number
  name: string
  description: string
  requirementNames: string[] | null
  storyName : string
  storyId : number
  isBuilt : boolean
  isSuccessfullyTested: boolean
}