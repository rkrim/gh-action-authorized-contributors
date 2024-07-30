const core = require("@actions/core")
const exec = require("@actions/exec")
const simpleGit = require("simple-git")
const git = simpleGit()

const checkAuthor = process.env.INPUT_CHECK_AUTHOR
const checkCommitter = process.env.INPUT_CHECK_COMMITTER
const authorizedContributorsFile = process.env.INPUT_CONTRIBUTORS_FILE
const authorMappingFile = process.env.INPUT_CONTRIBUTORS_MAPPING_FILE

console.log("Hello World!")
console.log(`checkAuthor: ${checkAuthor}`)
console.log(`checkCommitter: ${checkCommitter}`)
console.log(`authorizedContributorsFile: ${authorizedContributorsFile}`)
console.log(`authorMappingFile: ${authorMappingFile}`)





async function commitsInRange(baseBranch, headBranch) {
	
	console.log(`baseBranch: '${baseBranch}'`)
	console.log(`headBranch: '${headBranch}'`)

	// Validate branches
	if (!baseBranch || !headBranch) {
		console.error('Error: Both baseBranch and headBranch must be non-empty strings.');
		return;
	}
	if (baseBranch === headBranch) {
		console.error('Error: baseBranch and headBranch must not be the same.');
		return;
	}

	try {
		// Fetch all branches and commits
		baseBranch = "main"
		headBranch = "HEAD"

		const log = await git.log({ from: baseBranch, to: headBranch });
		if (log.all.length === 0) {
			console.log(`No commits found between ${baseBranch} and ${headBranch}`);
		} else {
			console.log(`Commits between ${baseBranch} and ${headBranch}:`);
			log.all.forEach(commit => {
				console.log(`${commit.hash} ${commit.message}`);
			});
		}
	} catch (error) {
		console.error(`Failed to get commits: ${error}`);
	}
}


async function run() {
	try {
			const checkAuthor = core.getInput("check_author")
			console.log(`checkAuthor: ${checkAuthor}`)

			const baseBranch = core.getInput("base_branch")
			const headBranch = core.getInput("head_branch")

			commitsInRange(baseBranch, headBranch)

			const src = __dirname
			// await exec.exec(`${src}/check-authorized-contributors.sh`)
	} catch (error) {
			core.setFailed(error.message)
	}
}

run()
