var connect = 'mysql://' + F.config['db-user'] + ':' + F.config['db-password'] + '@' + F.config['db-host'] + '/' + F.config['db-database'];
require('sqlagent/mysql').init(connect, F.config['db-debug']);
