#!/usr/bin/env sh

# Check Commits from command line arguments
if [ $# -gt 0 ]; then
    COMMITS="$@"
else
    COMMITS=$(git log origin/main..HEAD --pretty=format:"%H")
fi

# Check authorized contributors
AUTHORIZED_CONTRIBUTORS_FILE="authorized-contributors"
authorized_contributors="$(grep -v '^#' "${AUTHORIZED_CONTRIBUTORS_FILE}")"

# Display Process Input
echo "----------------------------------------"
echo "AUTHORIZED CONTRIBUTORS:"
echo "$authorized_contributors"
echo "----------------------------------------"
echo "LIST OF COMMITS TO CHECK AGAINST AUTHORIZATION:"
echo "$COMMITS"
echo "----------------------------------------"

COLOR_RED='\033[0;31m'
COLOR_RESET='\033[0m'


# Process commits for validation
for COMMIT in $COMMITS; do
    DESCRIPTION=$(git log -1 --pretty=format:"%s" $COMMIT)
    AUTHOR_DETAILS=$(git log -1 --pretty=format:"%an <%ae>" $COMMIT)
    COMMITTER_DETAILS=$(git log -1 --pretty=format:"%cn <%ce>" $COMMIT)

    echo "Processing commit '$COMMIT':"
    echo "> Description: $DESCRIPTION"
    echo "> Author: $AUTHOR_DETAILS"
    echo "> Committer: $COMMITTER_DETAILS"

    # Check if the author is listed in the authorized-contributors list
    if !(echo "$authorized_contributors" | grep -q "^${AUTHOR_DETAILS}$") || 
        !(echo "$authorized_contributors" | grep -q "^${COMMITTER_DETAILS}$"); then
        if [[ "${TERM}" =~ ^(xterm-?.*|screen|rxvt|linux|vt100|vt220|vt102)$ || "$GITHUB_ACTIONS" == "true" ]]; then
            echo -e "${COLOR_RED}Changes by author or commiter are not authorized.$COLOR_RESET"
            echo -e "${COLOR_RED}Please, check and/or update informations to '$AUTHORIZED_CONTRIBUTORS_FILE'.$COLOR_RESET"
            echo -e "${COLOR_RED}Then, Create a pull request to grant authorization.$COLOR_RESET"
        else
            echo "Changes by author or commiter are not authorized."
            echo "Please, check and/or update informations to '$AUTHORIZED_CONTRIBUTORS_FILE'."
            echo "Then, Create a pull request to grant authorization."
        fi
        echo "----------------------------------------"
        exit 1
    fi
    echo "----------------------------------------"
done

exit 0
