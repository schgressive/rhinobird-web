## BETA CONFIGURATION
set :nginx_domains, "staging.rhinobird.tv"
set :branch, "build"

server 'godel.rhinobird.tv', user: 'deploy', roles: %w{web app db}
