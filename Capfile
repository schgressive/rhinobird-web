# Load DSL and Setup Up Stages
require 'capistrano/setup'

# Includes default deployment tasks
require 'capistrano/deploy'

# Includes tasks from other gems included in your Gemfile
#
# For documentation on these, see for example:
#
#   https://github.com/capistrano/rvm
#   https://github.com/capistrano/rbenv
#   https://github.com/capistrano/chruby
#   https://github.com/capistrano/bundler
#   https://github.com/capistrano/rails/tree/master/assets
#   https://github.com/capistrano/rails/tree/master/migrations

# CAPISTRANO
# require 'capistrano/rvm'
require 'capistrano/rbenv'
# require 'capistrano/chruby'
require 'capistrano/bundler'
# require 'capistrano/rails/assets'
# require 'capistrano/rails/migrations'
require 'capistrano-nc/nc'


# NODE
require 'capistrano/nodenv'
require 'capistrano/bower'
require 'capistrano/npm'
require 'capistrano/grunt'

# require 'capistrano3/unicorn'

require 'capistrano/nginx'
# require 'capistrano/puma'
# require 'capistrano/eye'

require 'negroku/deploy'
# require 'negroku/logs'
# require 'negroku/unicorn'
# require 'negroku/eye'

# Loads custom tasks from `lib/capistrano/tasks' if you have any defined.
Dir.glob('lib/capistrano/tasks/*.cap').each { |r| import r }
