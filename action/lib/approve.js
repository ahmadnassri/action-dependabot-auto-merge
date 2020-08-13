module.exports = async function (octokit, event) {
  const { data: { id } } = await octokit.pulls.createReview({
    owner: event.repository.owner.login,
    repo: event.repository.name,
    pull_number: event.pull_request.number
  })

  await octokit.pulls.submitReview({
    owner: event.repository.owner.login,
    repo: event.repository.name,
    pull_number: event.pull_request.number,
    event: 'APPROVE',
    review_id: id
  })
}
