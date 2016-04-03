// MIT License
// Copyright Tomáš Novák <tomasnovak@tonova.sk>

exports.id = 'SchemaGenerator';

function SchemaGenerator(tableName, schemaName, fileName, directory) {
	this.schema = {};
	this.table = tableName;
	this.schemaName = schemaName || this.table;
	this.fileName = fileName || this.schemaName;
	this.directory = directory || F.config['directory-models'];
}

SchemaGenerator.prototype.getSchema = function(callback) {
	var self = this;
	var sql = DB();

	var result = [];
	sql.query('explain', 'EXPLAIN ' + this.table);

	sql.exec(function(err, response) {
		response.explain.forEach(function(r) {

			var required = (r.Null == 'YES' ? ', true' : '');
			var inputType = r.Type;
			var type = '';

			if((inputType.match('int') || inputType.match('^float') || inputType.match('double') || inputType.match('decimal')) !== null)
				type = 'Number';

			if((inputType.match('^time') || inputType.match('^date')) !== null)
				type = 'Date';

			if(inputType.match('^bool') !== null)
				type = 'Boolean';

			if(inputType.match('^varchar') !== null)
				type = inputType.replace(/varchar/g, "\'string") + '\'';

			if((inputType.match('text') || inputType.match('binary') || inputType.match('blob') || inputType.match('^enum') || inputType.match('^set') || inputType.match('^char')) !== null)
				type = 'String';

			var build = '    schema.define(\'' + r.Field + '\', ' + type + required + ');\n';
			result.push(build);
		});

		callback(result.join(""));
	});
}

SchemaGenerator.prototype.getValidator = function(callback) {
	var self = this;
	var sql = DB();

	var result = [];
	sql.query('explain', 'EXPLAIN ' + this.table);

	sql.exec(function(err, response) {

		var template = '';
		response.explain.forEach(function(r) {
			var columnName = r.Field;
			var required = (r.Null == 'YES' ? true : false);

			var condition = (columnName.match(/email/i) !== null) ? 'return value.isEmail();' : 'return value.length > 0;';
		 	
			
			if(required) {
				template += '            case \'' + columnName + '\'\:\n';
				template += '                ' + condition + '\n';
			}
		});

		result = '    schema.setValidate(function(name, value) {\n';
		result += '        switch (name) {\n';
		result += template;
		result += '        }\n';
		result += '    });\n';
		callback(result);
	});
}

SchemaGenerator.prototype.getDefault = function(callback) {
	var self = this;
	var sql = DB();

	var result = [];
	sql.query('explain', 'EXPLAIN ' + self.table);

	sql.exec(function(err, response) {

		var template = '';
		response.explain.forEach(function(r) {
			var columnName = r.Field;
			var required = (r.Null == 'YES' ? true : false);

			var condition = (columnName.match(/email/i) !== null) ? 'return value.isEmail();' : 'return value.length > 0;';
		 	
			
			if(required) {
				template += '            case \'' + columnName + '\'\:\n';
				template += '                ' + condition + '\n';
			}
		});

		result = '    schema.setValidate(function(name, value) {\n';
		result += '        switch (name) {\n';
		result += template;
		result += '        }\n';
		result += '    });\n';
		callback(result);
	});
}

SchemaGenerator.prototype.generate = function(callback) {
	var self = this;
	var template = '';
	var arr = [];

	arr.push(function(next) {
		self.getSchema(function(schema) {
			template += 'NEWSCHEMA(\'' + self.schemaName + '\').make(function(schema) {\n\n';
			template += schema + '\n\n';
			next();
		});
	});

	arr.push(function(next) {
		self.getValidator(function(validator) {
			template += validator + '\n';
			template += '});';
			next();
		});
	});

	arr.async(function() {

		var fs = require('fs');
		
	    fs.writeFile('.' + self.directory + self.fileName + '.js', template, {flag: 'w'}, function(err) {
		    if(err) {
		        callback(err);
		    }
			callback(SUCCESS());
		});
		

		return;
	});
}

module.exports = SchemaGenerator;
