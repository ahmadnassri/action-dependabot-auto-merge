module.exports = async function (octokit, { repo, payload: { pull_request } }) { // eslint-disable-line camelcase
  const { data: { id } } = await octokit.pulls.createReview({
    ...repo,
    pull_number: pull_request.number
  })

  await octokit.pulls.submitReview({
    ...repo,
    pull_number: pull_request.number,
    event: 'APPROVE',
    review_id: id
  })
}
