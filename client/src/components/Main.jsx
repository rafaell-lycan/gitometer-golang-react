// eslint-disable-next-line
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { fetch } from '../utils/api'
import storage from '../utils/storage'
import repositoryDataMapper from '../utils/repositoryDataMapper'
import commitsDataMapper from '../utils/commitsDataMapper'
import starsDataMapper from '../utils/starsDataMapper'

import SingleRepository from './SingleRepository/Main'
import RepositoriesList from './RepositoriesList/Main'
import Settings from './Settings'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repositoriesData: null,
      repositoryData: null,
    }
  }

  getRepositoriesData = () => {
    this.setState({ repositoriesData: storage.get('repositories') || [] })
  }

  getRepositoryData = async (owner, name) => {
    const repoData = await repositoryDataMapper(owner, name)
    const commitData = await commitsDataMapper(owner, name)
    const starsData = await starsDataMapper(owner, name)

    let newRepositoryData = Object.assign({}, this.state.repositoryData)
    if (!newRepositoryData) {
      newRepositoryData = {}
    }
    if (!newRepositoryData[owner]) {
      newRepositoryData[owner] = {}
    }

    const repository = {
      ...repoData,
      ...commitData,
      ...starsData,
    }

    console.log('repository', repository)

    newRepositoryData[owner][name] = {
      repository,
    }

    this.setState({
      repositoryData: newRepositoryData,
    })
  }

  addNewRepository = async (owner, name) => {
    try {
      const { data: { stargazers_count: totalStars } } = await fetch('get', `/repos/${owner}/${name}`)
      const repos = this.state.repositoriesData ? this.state.repositoriesData.splice(0) : []

      repos.push({ name, ownerName: owner, totalStars })
      storage.set('repositories', repos)
      this.getRepositoriesData()
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }

  render() {
    return (
      <main>
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              (<RepositoriesList
                getRepositoriesData={this.getRepositoriesData}
                addNewRepository={this.addNewRepository}
                data={this.state.repositoriesData}
              />)}
          />
          <Route
            path="/repositories/:owner/:name"
            render={(props) => {
              let data = null
              if (
                this.state.repositoryData &&
                this.state.repositoryData[props.match.params.owner] &&
                this.state.repositoryData[props.match.params.owner][props.match.params.name]
              ) {
                data = this.state.repositoryData[props.match.params.owner][props.match.params.name]
              }
              return (
                <SingleRepository
                  match={props.match}
                  data={data}
                  getRepositoryData={this.getRepositoryData}
                />
              )
            }}
          />
          <Route path="/settings" component={Settings} />
        </Switch>
      </main>
    )
  }
}

export default Main
