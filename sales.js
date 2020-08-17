const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const consoleTable = require('console.table');
const util = require('util');
const moment = require('moment');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'pinultimate'
});

connection.connect(err => {
  if (err) throw err;
  console.log(' ');
  start();
});

const queryAsync = util.promisify(connection.query).bind(connection);

async function start() {
	const answer = await inquirer.prompt({
		name: 'menu',
		type: 'list',
		message: 'What would you like to do?',
		choices: [
			'Faire: View Sales Table',
			'Faire: View Sales Total',
			'Exit'
		]
	});
	switch (answer.menu) {
		case 'Faire: View Sales Table':
			viewFaireTable();
			break;
		case 'Faire: View Sales Total':
			viewFaireTotal();
			break;
		case 'Exit':
			console.log(' ');
			connection.end();
			break;
	}
};

async function viewFaireTable() {
	const res = await queryAsync('SELECT * FROM faire');
	const faireTable = [];
	console.log(' ');
    for (let i of res) {
	    i.payout = i.payout.toFixed(2);
	    faireTable.push({ 'ORDER DATE': moment(i.orderDate, 'YYYY-MM-DD').format('MM/DD/YY'), RETAILER: i.retailer, COMMISSION: `${i.commission}%`, PAYOUT: `$${i.payout}` });
    }
    console.table(faireTable);
    start();
};

async function viewFaireTotal() {
	const res = await queryAsync('SELECT faire.payout FROM faire');
	let orderTotal = 0;
	for (let i of res) {
		orderTotal += i.payout;
	}
	console.log('\n' + chalk.dim('Total Sales:') + ' $' + orderTotal.toFixed(2) + '\n');
    start();
};