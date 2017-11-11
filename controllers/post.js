var config = require('../config');
var tools  = require('../api/tools');
var fmdb   = require('../fmdb');
var topic_passed = fmdb.topic_passed;

exports.upload = upload;  // 上传帖子
exports.pass   = pass;    // 审核帖子
exports.index  = index;   // 展示首页
exports.pleaseBook   = pleaseBook;    // please
exports.donatedBook  = donatedBook;   // donated
exports.topic  = topic;   // 展示某个帖子

function index (req, res, next) {
	var option = {
		condition: {type:"topic" },
		sort: {create_date: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		res.render('index', {
			user: req.user,
			topic: item.topic,
			count: item.topic_count,
			user_rank: item.user_rank,
			type: item.type,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/p', // 跳转的地址头
			title: config.title,
			subfield: 0
		});
	});
}

function pleaseBook (req, res, next) {
	var option = {
		condition: {type: "pleaseBook"},
		sort: {create_date: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		res.render('index', {
			user: req.user,
			topic: item.topic,
			count: item.topic_count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/pleaseBook/p', // 跳转的地址头
			title: config.title,
			subfield: 1
		});
	});
}

function donatedBook (req, res, next) {
	var option = {
		condition: {type: "donatedBook"},
		sort: {create_date: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		res.render('index', {
			user: req.user,
			topic: item.topic,
			count: item.topic_count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/donatedBook/p', // 跳转的地址头
			title: config.title,
			subfield: 2
		});
	});
}

function upload (req, res, next) {
	var token = req.session.token;
	if (token === undefined) return res.redirect('/user/login');
	res.render('./post/upload', {
		user: req.user,
		title: '上传图片'
	});
}

function pass (req, res, next) {
	res.render('./post/pass', {
		user: req.user,
		title: '审核图片'
	});
}

// 展示某个帖子
function topic(req, res, next) {
	var option = {
		condition: {_id: req.params.topic},
		userInfo: req.user.info
	};
	topic_passed.getTopicById (option, function (err, item) {
		if (err || item.topic.length < 1) return next(new Error('not find topic'));
		res.render('./user/topic', {
			user: req.user,
			topic: item.topic,
			topic_count: item.count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			author: item.topic[0].author || [],
			title:  item.topic[0].title
		})
	});
}