import moment from 'moment'

import { fetchCollection } from './api'

const TOTAL_STARS = 'total_stars'
const STARS_LAST_12_MONTHS = 'stars_count_last_12_months'
const STARS_LAST_4_WEEKS = 'stars_count_last_4_weeks'
const STARS_LAST_WEEK = 'stars_count_last_week'
const STARS_PER_MONTH = 'stars_per_month'

function diffCommitByPeriod(commit, period, condition) {
  const diff = moment().diff(commit.commit.author.date, period)
  return condition(diff)
}

const starsDataMapper = async (owner, name) => {
  const mappedData = {
    [TOTAL_STARS]: 0,
    [STARS_LAST_12_MONTHS]: 0,
    [STARS_LAST_4_WEEKS]: 0,
    [STARS_LAST_WEEK]: 0,
    [STARS_PER_MONTH]: '',
  }

  const collection = await fetchCollection('get', `/repos/${owner}/${name}/stargazers`)

  return collection.reduce((data, star) => {
    data[TOTAL_STARS] += 1
    data[STARS_LAST_12_MONTHS] += 1
    data[STARS_LAST_4_WEEKS] += 1
    data[STARS_LAST_WEEK] += 1

    return data
  }, mappedData)
}

export default starsDataMapper
