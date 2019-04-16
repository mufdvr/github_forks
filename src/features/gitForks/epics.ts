import Types from 'Types'
import { Epic } from 'redux-observable'
import { filter, switchMap, map, catchError, timeout } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { of } from 'rxjs'
import { combineEpics } from 'redux-observable'

import { fetchIssues, fetchRepos } from './actions'
import { IssuesSearchingAction, ReposAction } from './reducer'
import * as apiEndpoints from './apiEndpoints'
import { IIssueDTO, Issue } from './models'

export const fetchIssuesAction: Epic<IssuesSearchingAction, IssuesSearchingAction, Types.RootState, Types.Services> = (
  action$,
  // tslint:disable-next-line:variable-name
  _state$,
  { getJSON }
) =>
  action$.pipe(
    filter(isActionOf(fetchIssues.request)),
    switchMap(action =>
      getJSON(apiEndpoints.repoIssues(action.payload)).pipe(
        timeout(10000),
        map((res: any) => res.map((issue: IIssueDTO) => Issue.create(issue))),
        map(payload => ({
          userName: action.payload.userName,
          repoName: action.payload.repoName,
          payload,
        })),
        map(fetchIssues.success),
        catchError(error => of(fetchIssues.failure(error.response ? { message: error.response.message, status: error.status } : error)))
      )
    )
  )

  export const fetchReposAction: Epic<ReposAction, ReposAction, Types.RootState, Types.Services> = (
    action$,
    // tslint:disable-next-line:variable-name
    _state$,
    { getJSON }
  ) =>
    action$.pipe(
      filter(isActionOf(fetchRepos.request)),
      switchMap(action =>
        getJSON(apiEndpoints.userRepos(action.payload)).pipe(
          timeout(10000),
          map((res: any) => res.map(({ name }: any) => name)),
          map(fetchRepos.success),
          catchError(error => of(fetchRepos.failure(error.response ? { message: error.response.message, status: error.status } : error)))
        )
      )
    )

export default combineEpics(fetchIssuesAction, fetchReposAction)
