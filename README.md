www-quilombola-kr
=====================

Repository for quilombola.kr domain.

To clone this repository on a new AWS EC2 instance --

Copy the contents of the 1st script of this README.md, dump a copy into machine-setup.bash just as you log in as ubuntu for the first time,
and run this on a new EC2 instance running Ubuntu 12.04.2 LTS to configure both the machine and the environment for 
developing the Quilombola app:

```

#!/bin/bash 
# script name : machine-setup.bash
#
cd $HOME
sudo apt-get install -y git-core
git clone https://github.com/munair/aws_ec2_no_emacs_setup.git
./aws_ec2_no_emacs_setup/setup.sh   

# Next, create an SSH key and (by copy/pasting with the mouse)
# add it to Github at https://github.com/settings/ssh
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub

# Now you can clone via SSH from github.
# Cloning over SSH allows you to push/pull changes.
# Use the credential helper with caching set to 1 hour to avoid
# having to repeatedly enter your username and password.
git clone https://github.com/munair/www-quilombola-kr.git
git config --global user.name "Munair Simpson"
git config --global user.email "munair@gmail.com"
git config --global credential.helper 'cache --timeout=3600'

# Next change into the app directory and get all
# npm dependencies.
cd www-quilombola-kr
npm install express
npm install postmark

# Login and add the SSH key created previously to Heroku
# Then create Heroku apps if they don't already exit.
# Add all necessary add-ons if creating Heroku apps.
heroku login
heroku keys:add

git checkout development

```

Copy the contents of the 2nd script of this README.md, dump a copy into edit.bash to programmatically progress your edits to the live app
and repository on GitHub.

```

#!/bin/bash
# script name : edit.bash
# script args : $1 -- file to be edited
#		$2 -- comments for git
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
git checkout staging
git branch
sleep 5
git merge development
git push origin staging
heroku git:remote -a munair-quilombola-kr-staging -r staging-heroku
curl http://munair-quilombola-kr-staging.herokuapp.com | more
git push staging-heroku staging:master
git checkout master
git branch
sleep 5
git merge staging
git push origin master
heroku git:remote -a munair-quilombola-kr -r production-heroku
git push production-heroku master:master
curl http://munair-quilombola-kr.herokuapp.com | more
git checkout development

```

See also http://www.quilombola.kr and [Heroku](https://www.heroku.com) for more details.

