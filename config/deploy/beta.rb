## STAGING CONFIGURATION

# Servers and their roles.
server "church.rhinobird.tv", :web, :app, :db, primary: true

# Web server configuration
set :domains, 		"beta.rhinobird.tv"

# Source
#set :branch,     	"deploy"		# Optional, defaults to master
# set :remote,   	"origin"			# Optional, defaults to origin

# Rails
# set :rails_env, 	"staging"		# Optional, defaults to production
