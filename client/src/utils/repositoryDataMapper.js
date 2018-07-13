import moment from 'moment'

import { fetch } from './api'

fetch

const repositoryDataMapper = async (owner, name) => {
  const { data } = await fetch('get', `/repos/${owner}/${name}`)

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    owner: data.owner.login,
    avatar_url: data.owner.avatar_url,
    url: data.html_url,
    repository_created_months_ago: moment().diff(data.created_at, 'months'),
  }
}

export default repositoryDataMapper
