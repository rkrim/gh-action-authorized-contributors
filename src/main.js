const core = require("@actions/core")
const exec = require("@actions/exec")


const checkAuthor = process.env.INPUT_CHECK_AUTHOR
const checkCommitter = process.env.INPUT_CHECK_COMMITTER
const authorizedContributorsFile = process.env.INPUT_CONTRIBUTORS_FILE
const authorMappingFile = process.env.INPUT_CONTRIBUTORS_MAPPING_FILE

console.log("Hello World!")
console.log(`checkAuthor: ${checkAuthor}`)
console.log(`checkCommitter: ${checkCommitter}`)
console.log(`authorizedContributorsFile: ${authorizedContributorsFile}`)
console.log(`authorMappingFile: ${authorMappingFile}`)


async function run() {
    try {
        const checkAuthor = core.getInput("check_author")
        console.log(`checkAuthor: ${checkAuthor}`)


        const src = __dirname
        await exec.exec("${src}/check-authorized-contributors.sh")
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
