#https://stackoverflow.com/questions/41946475/git-why-cant-i-delete-my-branch-after-a-squash-merge
git checkout main
git fetch
git pull
git for-each-ref refs/heads/ "--format=%(refname:short)" | while read branch; do mergeBase=$(git merge-base main $branch) && [[ $(git cherry main $(git commit-tree $(git rev-parse $branch\^{tree}) -p $mergeBase -m _)) == "-"* ]] && git branch -D $branch; done