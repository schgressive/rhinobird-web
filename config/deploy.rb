#########################################
# Negroky deploy.rb configuration file
#
# There are three types of settings here
#  * Capistrano settings
#  * Gem specific settings
#  * Negroku settings

set :application,   "rhinobird-web"
set :api_application, "rhinobird-api"

set :repo_url,      'https://github.com/rhinobird/rhinobird-web.git'
set :deploy_to,     "/home/deploy/applications/#{fetch(:application)}"

linked_files = Set.new(fetch(:linked_files, [])) # https://github.com/capistrano/rails/issues/52
linked_files.merge(%w{})
set :linked_files, linked_files.to_a

linked_dirs = Set.new(fetch(:linked_dirs, [])) # https://github.com/capistrano/rails/issues/52
linked_dirs.merge(%w{node_modules})
set :linked_dirs, linked_dirs.to_a

set :nginx_template, "#{stage_config_path}/#{fetch :stage}/nginx.conf.erb"

set :app_server_assets, '/home/deploy/applications/rhinobird-api/current/public'
set :nginx_static_dir, 'dist'

set :npm_flags, '--quiet'

fetch(:nodenv_map_bins) << 'grunt'

set :grunt_flags, '--no-color'
set :grunt_tasks, 'build'
before 'deploy:updated', 'grunt'
