module.exports = async function (octokit, context) {
  const { data: { id } } = await octokit.pulls.createReview({
    owner: context.repository.owner.login,
    repo: context.repository.name,
    pull_number: context.pull_request.number
  })

  await octokit.pulls.submitReview({
    owner: context.repository.owner.login,
    repo: context.repository.name,
    pull_number: context.pull_request.number,
    event: 'APPROVE',
    review_id: id
  })
}
