## BETA CONFIGURATION
set :nginx_domains, "beta.rhinobird.tv"
set :branch, "production"

server 'church.rhinobird.tv', user: 'deploy', roles: %w{web app db}
