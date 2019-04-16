import { StateType } from 'typesafe-actions'
import { issuesSearchingAction, ReposAction } from 'features/gitForks'
import rootReducer from './root-reducer'

declare module 'Types' {
  export type RootState = StateType<typeof rootReducer>
  export type RootAction = issuesSearchingAction | ReposAction
}
