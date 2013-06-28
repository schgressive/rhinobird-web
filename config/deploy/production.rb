## PRODUCTION CONFIGURATION

# Servers and their roles.
server "church.peepol.tv", :web, :app, :db, primary: true

# Web server configuration
set :domains, 		"www.peepoltv.com"

# Source
set :branch,     	"production"		# Optional, defaults to master
# set :remote,   	"origin"			# Optional, defaults to origin

# Rails
# set :rails_env, 	"production"		# Optional, defaults to production
