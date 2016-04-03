# total.js schema builder generator for mysql

__Requirements__:

`npm install total.js`
`npm install mysql`
`npm install sqlagent`
`npm install fs`

__Initialization__:

- Setup mysql connection in `config` file
- Setup mysql table in `controllers/default.js`
- Open `127.0.0.1:8000/schema-builder/`

__Usage__:

#### Simple setup

```javascript
var SchemaGenerator = MODULE('SchemaGenerator');
var generator = new SchemaGenerator('table_name');
generator.generate(function(callback) {
	self.plain(callback);
});
```

#### Advanced
```javascript
var SchemaGenerator = MODULE('SchemaGenerator');
// Important directory must be created. Directory format "/directory/" must be preserved
var generator = new SchemaGenerator('table_name', 'schema_name', 'file_name', '/directory/');
generator.generate(function(callback) {
	self.plain(callback);
});
```
---
MIT License
2016 Copyright Tomáš Novák <tomasnovak@tonova.sk>

