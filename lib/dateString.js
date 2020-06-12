exports.get = function () {
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = date.getMonth().toString().padStart(2, 0);
	const day = date.getDate().toString().padStart(2, 0);
	return `${year}${month}${day}`;
};

exports.parse = function (dateString) {
	let year = parseInt(dateString.substr(0, 4));
	let month = parseInt(dateString.substr(4, 2));
	let day = parseInt(dateString.substr(6, 2));
	return new Date(year, month - 1, day);
};
