www-quilombola-kr
=====================

Repository for quilombola.com domain.

To clone this repository on a new AWS EC2 instance --

Copy the contents of the 1st script of this README.md, dump a copy into machine-setup.bash just as you log in as ubuntu for the first time,
and run this on a new EC2 instance running Ubuntu 12.04.2 LTS to configure both the machine and the environment for 
developing the Quilombola app:

```

#!/bin/bash 
# script name : machine-setup.bash
#
# takes as arguments:
#   - ubuntu@$1 : Amazon EC2 Instance URL
#   - $2 : Repository on GitHub
#
#

ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 sudo apt-get install -y git-core
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 git clone https://github.com/munair/aws_ec2_no_emacs_setup.git
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 ./aws_ec2_no_emacs_setup/setup.sh   

# Next, create an SSH key and (by copy/pasting with the mouse)
# add it to Github at https://github.com/settings/ssh
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 "ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa"
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 "cat ~/.ssh/id_rsa.pub"

# Now you can clone via SSH from github.
# Cloning over SSH allows you to push/pull changes.
# Use the credential helper with caching set to 1 hour to avoid
# having to repeatedly enter your username and password.
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 git clone https://github.com/munair/$2.git
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 git config --global user.name "Munair Simpson"
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 git config --global user.email "munair@gmail.com"
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 git config --global credential.helper 'cache --timeout=3600'

# Next change into the app directory and get all
# npm dependencies.
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 "cd $2; npm install express"
ssh -i ~/Downloads/developmentroad.pem ubuntu@$1 "cd $2; npm install postmark"


```

Copy the contents of the 2nd script of this README.md, dump a copy into edit.bash to programmatically progress your edits to the live app
and repository on GitHub.

```

#!/bin/bash
# script name : edit.bash
# script args : $1 -- file to be edited
#       $2 -- comments for git
#       $3 -- remove interactivity if parameter equals "noprompting"
#
# Make certain that you are only editing the development branch.
# Edit the file supplied as an argument to this script.
#
# The script ensures that edits are pushed to the development 
# branch at the origin before checking out staging to merge
# the edits previously made into staging. The script then pushes
# the merge into the staging branch back at the origin.
#
# After pushing the merge to staging at the origin we are ready to
# deploy to Heroku. Consequently the script lets git know about the
# staging Heroku app for the domain and identifies it as "staging-
# heroku". Then the push is made.
#
# Finally we check out the master branch, verify (--as always), and 
# merge the changes made to the staging branch. Of course this assumes
# that we actually bothered to checkout the staging site and viewed
# the new source code to verify changes and successful implementation.
# Then the changes are pushed to the master branch at the origin at
# GitHub, before identifying and then pushing the changes to the "live"
# or "production" instance ("production-heroku) at Heroku.
# 
git checkout development
git branch
sleep 5
vi $1
git add $1
git commit -m "$2"
git push origin development
[ $3 == "noprompting" ] || while true; do
    read -p "shall we push changes to the staging GitHub repository and the staging instance on Heroku? " yn
    case $yn in
        [Yy]* ) echo "proceeding..."; break;;
        [Nn]* ) exit;;
        * ) echo "please answer yes or no.";;
    esac
done
git checkout staging
git branch
sleep 5
git merge development
git push origin staging
cat ~/.netrc | grep heroku || heroku login && heroku keys:add ~/.ssh/id_rsa.pub
heroku git:remote -a staging-quilombola-kr -r staging-heroku
git push staging-heroku staging:master
[ $3 == "noprompting" ] || while true; do
    read -p "shall we push changes to the master GitHub repository and the production instance on Heroku? " yn
    case $yn in
        [Yy]* ) echo "proceeding..."; break;;
        [Nn]* ) exit;;
        * ) echo "please answer yes or no.";;
    esac
done
git checkout master
git branch
sleep 5
git merge staging
git push origin master
heroku git:remote -a www-quilombola-kr -r production-heroku
git push production-heroku master:master
git checkout development


```

See also http://www.quilombola.com and [Heroku](https://www.heroku.com) for more details.

