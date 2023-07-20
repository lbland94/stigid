@Library('integration-pipelines') _

nodejsBuild(
  nodeVersion: '14',
  // Available versions list at https://artifactory.panerabread.com/artifactory/docker-registry-internal/ci/
  jenkinsAgent: 'node14-chrome-jenkins-c8',
  skipTest: true,
  preBuildClosure: {
    sh '''
      npm run install:ui
      npm run lint
      '''
  },
  postBuildClosure: {
    sh '''
      npm run build
      '''
  },
  integrationBranches: ['release/.*'],
  tagSource: false,
)