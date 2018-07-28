import path from 'path';
const util = require('util');
const fs = require('fs');

//Prebuilt Construction Strings
const imports = `let chai = require('chai');
let chaiHttp = require('chai-http');
let addContext = require('mochawesome/addcontext');
let expect = chai.expect;
let should = chai.should();
chai.use(chaiHttp);

let server = '%s';

%s
`
const endpointLayer = `describe(\'%s\', () => {%s
});`
const requestLayer = `
	describe(\'%s\', () => {%s
	});`;
const endpointRequestLayer = `
		describe(\'%s\', () => {%s
		});`;
const testLayer = `
			it('%s', function(done) {
				chai.request(server)
					.%s('/%s')
					.query(%s)
					.end((err, res) => {
						addContext(this, {
							title: 'API URL',
							value: server + '/%s'
						});
						addContext(this, {
							title: 'Status Codes',
							value: res.statusCode
						});
						addContext(this, {
							title: 'Response Body',
							value: res.body
						});
						res.should.have.status(%s);%s
						done();
					});
			});`;

const checkArray = `						res.body.forEach(o => {%s
						});`;

//Main function
const generateTestcases = function(endpoint, testcases) {
	let gets = [];
	let posts = [];
	let puts = [];
	let deletes = [];
  let tpf = JSON.parse(fs.readFileSync(endpoint.data.tpfPath, 'utf8'));
	let endpointPath = endpoint.name.replace(new RegExp('&', 'g'), '/');
	testcases.forEach(testcase => {
		switch(testcase.testcaseInformation.requestType) {
			case 'GET':
				gets.push(testcase);
				break;
			case 'POST':
				posts.push(testcase);
				break;
			case 'PUT':
				puts.push(testcase);
				break;
			case 'DELETE':
				deletes.push(testcase);
				break;
		}
	});
	if(gets.length > 0) {
		let getTestcaseFileString = generateRequestTestcases(gets, endpoint, 'GET', tpf.apiURL);
		generateTestcaseFile(getTestcaseFileString, endpoint, 'GET');
	}
	if(posts.length > 0) {
		let postTestcaseFileString = generateRequestTestcases(posts, endpoint, 'POST', tpf.apiURL);
		generateTestcaseFile(postTestcaseFileString, endpoint, 'POST');
	}
	if(puts.length > 0) {
		let putsTestcaseFileString = generateRequestTestcases(puts, endpoint, 'PUT', tpf.apiURL);
		generateTestcaseFile(putsTestcaseFileString, endpoint, 'PUT');
	}
	if(deletes.length > 0) {
		let deletesTestcaseFileString = generateRequestTestcases(deletes, endpoint, 'DEL', tpf.apiURL);
		generateTestcaseFile(deletesTestcaseFileString, endpoint, 'DELETE');
	}
}

const generateQuery = function(parameters) {
	let query = {};
	parameters.forEach(parameter => {
		query[parameter.parameter] = parameter.value;
	});
	return query;
}

const generateRequestTestcases = function(requestTests, endpoint, type, server) {
	let testcaseStrings = '';
	for(let i = 0; i < requestTests.length; i++) {
		let testcase = requestTests[i];
		let testcaseName = testcase.testcaseName;
		let expectedResponseCode = testcase.testcaseInformation.expectedResponseCode;
		let query = JSON.stringify(generateQuery(testcase.testcaseInformation.parameters));
		let isArray = testcase.testcaseInformation.isArray;
		let expectedValues = testcase.testcaseInformation.expectedValues;

		let newLineTests = '\n';
		if(i == expectedValues.length - 1) {
			newLineTests = '';
		}

		let	assertObjectType = `\n						res.should.be.a('object');\n%s`
		if(isArray) {
			assertObjectType = `\n						res.body.should.be.a('array');\n						res.body.length.should.be.above(0);\n%s`
		}

		let valueChecks = '';
		for(let j = 0; j < expectedValues.length; j++) {
			let parameter = expectedValues[j].parameter;
			let type = expectedValues[j].type;
			let value = expectedValues[j].value;
			let propStringSingle = `						res.body.should.have.property('%s').that.equal('%s')%s`;
			let propOtherSingle = `						res.body.should.have.property('%s').that.equal(%s)%s`;
			let propStringMulti = `							o.should.have.property('%s').that.equal('%s')%s`;
			let propOtherMulti = `							o.should.have.property('%s').that.equal(%s)%s`;

			let newLineParams = '\n';
			if(i == expectedValues.length - 1) {
				newLineParams = '';
			}

			if(type == 'String') {
				if(isArray) {
					valueChecks += util.format(propStringMulti, parameter, value, newLineParams);
				} else {
					valueChecks += util.format(propStringSingle, parameter, value, newLineParams);
				}
			} else {
				if(isArray) {
					valueChecks += util.format(propOtherMulti, parameter, value, newLineParams);
				} else {
					valueChecks += util.format(propOtherSingle, parameter, value, newLineParams);
				}
			}
		}

		let fullAssertion = util.format(assertObjectType, valueChecks);
		let tL = util.format(testLayer, testcaseName, type.toLowerCase(), endpoint.name, query, endpoint.name, expectedResponseCode, fullAssertion);
		if(isArray) {
			if(valueChecks) {
				let arrayCheck = util.format(assertObjectType, util.format(checkArray, '\n' + valueChecks));
				tL = util.format(testLayer, testcaseName, type.toLowerCase(), endpoint.name, query, endpoint.name, expectedResponseCode, arrayCheck);
			}
		}
		testcaseStrings += tL;
	}
	let eRL = util.format(endpointRequestLayer, type + ' ' + endpoint.name, testcaseStrings);
	let rL = util.format(requestLayer, type, eRL);
	let eL = util.format(endpointLayer, endpoint.name, rL);

	return util.format(imports, server, eL);
}

const generateTestcaseFile = function(testfileString, endpoint, type) {
	let tefIndex = endpoint.tefPath.indexOf(endpoint.name + '.tef');
	let testcasePath = endpoint.tefPath.substring(0, tefIndex);
	let fileName = util.format('%s_%s.js', endpoint.name, type);
	let testcaseFilePath = path.join(testcasePath, fileName);
	fs.writeFileSync(testcaseFilePath, testfileString);
}

module.exports = generateTestcases;
