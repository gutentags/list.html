#!/bin/bash
set -e

HERE=$(cd -L $(dirname -- $0); pwd)
export PATH="$HERE/node_modules/.bin":"$PATH"
export GIT_DIR="$HERE/.git"
export GIT_INDEX_FILE=$(mktemp "$GIT_DIR/TEMP.XXXXXX")

export GIT_AUTHOR_NAME="Kris Kowal"
export GIT_AUTHOR_EMAIL="kris@cixar.com"
export GIT_AUTHOR_DATE="$NOW"
export GIT_COMMITTER_NAME="Kris Kowal"
export GIT_COMMITTER_EMAIL="kris@cixar.com"
export GIT_COMMITTER_DATE="$NOW"

function gentree1() {
    JS_BUNDLE=$(git hash-object -w <(mrs index.js))
    echo "100644 blob $JS_BUNDLE"$'\t'"bundle.js"
    HTML_BUNDLE=$(git hash-object -w bundle.html)
    echo "100644 blob $HTML_BUNDLE"$'\t'"index.html"
}

OVERLAY=$(gentree1 | git mktree)
git read-tree --empty
git read-tree --prefix=/ "$OVERLAY"
git add list.css
TREE=$(git write-tree --missing-ok)
PARENT=$(git rev-parse refs/heads/master)
COMMIT=$(git commit-tree -p "$PARENT" "$TREE" < <(echo "Create bundles"))

git update-ref refs/heads/gh-pages $COMMIT

rm $GIT_INDEX_FILE
