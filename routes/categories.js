const express = require('express');
const router = express.Router();

Category = require('../models/category.js');

router.get('/',(req, res, next) => {
  Category.getCategories((err,categories) => {
    if(err){
  	  res.send(err);
    }
    res.render('categories', {
  	  title:'Categories',
  	  categories:categories
    });
  });
});
//add categories
router.post('/add',(req, res, next) => {
  req.checkBody('title', 'Title is required').notEmpty();
  let errors = req.validationErrors();
  if(errors){
  	res.render('add_category', {
      errors: errors,
      title: 'Create Category'
  	});
  } else {
    let category = new Category();
	category.title = req.body.title;
	category.description = req.body.description;
	Category.addCategory(category, (err, category) => {
		if(err) {
			res.send(err);
		}
		req.flash('success','Category Saved');
		res.redirect('/manage/categories');
	});
  }
});

//Edit Categories
router.post('/edit/:id',(req, res, next) => {
  req.checkBody('title','Title is required.').notEmpty();
  let errors = req.validationErrors();
  if(errors) {
  	res.render('edit_category', {
      errors: errors,
      title: 'Edit Category'
  	});
  } else {
    let category = new Category();
	const query = {_id:req.params.id}
	const update = {title: req.body.title, description: req.body.description}
	Category.updateCategory(query,update,{}, (err, category) => {
		if(err) {
			res.send(err);
		}
		req.flash('success','Category Updated');
		res.redirect('/manage/categories');
	});
  }
});

//Delete Categories
router.delete('/delete/:id',(req, res, next) => {
	const query = {_id:req.params.id}
	console.log(query);
	Category.removeCategory(query, (err, category) => {
		if(err) {
			res.send(err);
		}
		res.status(200);
	});
});

module.exports = router;