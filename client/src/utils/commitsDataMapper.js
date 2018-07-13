import moment from 'moment'

import { fetchCollection } from './api'

const TOTAL_COMMITS = 'total_commits'
const COMMITS_LAST_12_MONTHS = 'commits_count_last_12_months'
const COMMITS_LAST_4_WEEKS = 'commits_count_last_4_weeks'
const COMMITS_LAST_WEEK = 'commits_count_last_week'

function countCommitsByPeriod(commits, period, condition) {
  return commits.filter((commit) => {
    const diff = moment().diff(commit.commit.author.date, period)
    return condition(diff)
  }).length
}

function diffCommitByPeriod(commit, period, condition) {
  const diff = moment().diff(commit.commit.author.date, period)
  return condition(diff)
}

const commitsDataMapper = async (owner, name) => {
  const mappedData = {
    [TOTAL_COMMITS]: 0,
    [COMMITS_LAST_12_MONTHS]: 0,
    [COMMITS_LAST_4_WEEKS]: 0,
    [COMMITS_LAST_WEEK]: 0,
  }

  const commits = await fetchCollection('get', `/repos/${owner}/${name}/commits`)

  return commits.reduce((data, commit) => {
    data[TOTAL_COMMITS] += 1

    if (diffCommitByPeriod(commit, 'months', (result => result <= 12))) {
      data[COMMITS_LAST_12_MONTHS] += 1
    }

    if (diffCommitByPeriod(commit, 'weeks', (result => result <= 4))) {
      data[COMMITS_LAST_4_WEEKS] += 1
    }

    if (diffCommitByPeriod(commit, 'weeks', (result => result <= 1))) {
      data[COMMITS_LAST_WEEK] += 1
    }

    return data
  }, mappedData)
}

export default commitsDataMapper
