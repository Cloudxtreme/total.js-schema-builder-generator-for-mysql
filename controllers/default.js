exports.install = function() {

	F.route('/schema-builder/', schema_builder);
};

function schema_builder() {
	var self = this;

	// Load SchemaGenerator module
	var SchemaGenerator = MODULE('SchemaGenerator');
	
	// SchemaGenerator(tableName, schemaName, fileName, directory)
	var generator = new SchemaGenerator('table_name');
	// or 
	// var generator = new SchemaGenerator('table_name', 'schema_name', 'file_name', '/directory/');

	generator.generate(function(callback) {
		 self.plain(callback);
	});
}