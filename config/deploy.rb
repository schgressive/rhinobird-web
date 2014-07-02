# Set server stages
set :stages, %w(production beta)
set :default_stage, "beta"
require 'capistrano/ext/multistage'

# Server-side information.
set :application, "rhinobird"
set :user,        "deploy"

# Repository (if any) configuration.
set :scm, :none
set :repository, "#{File.expand_path('dist')}"
set :deploy_to,   "/home/#{user}/applications/#{application}"
set :deploy_via, :copy
#set :deploy_env, 'dist'

set :copy_remote_dir, deploy_to
set :copy_exclude, [".git", ".DS_Store", ".gitmodules", "build", "grunt.js", "assets", "staging", "production"]
# set :git_enable_submodules, 1

set :use_sudo, false
set :keep_releases, 2

set :nginx_ssl_certificate, 'rhinobird.crt'
set :nginx_ssl_certificate_key,  'rhinobird.key'

task :uname do
    run "uname -a"
end

namespace :h5bp do
    task :build do
        system("grunt build") or fail
    end
    task :clean do
        system("grunt clean") or fail
    end
end

task :cleanup do;
    if releases.length > 7
        logger.info "Too many releases, running deploy:cleanup."
        deploy.cleanup
    end
end;

before 'deploy', 'h5bp:build'
after 'deploy', 'h5bp:clean', :cleanup
