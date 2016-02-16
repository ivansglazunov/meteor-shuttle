Shuttle = {};

// Shuttle.get(tree, object, subject) => Cursor
Shuttle.get = function(tree, object, subject) {
	if (!subject) {
		var user = Meteor.user();
		if (user) var subject = user;
		else var subject = Meteor.users.findOne('guest');
	}
	if (!subject) {
		var subject = Meteor.users._transform({ _id: 'guest' });
	}
	var subjects = Shuttle.Subjects.find(subject.Ref('_source')).fetch();
	var $or = [subject.Ref('_target')];
	for (var s in subjects) {
		$or.push(subjects[s].target().Ref('_target'));
	}
	var query = object.Ref('_source');
	query['$or'] = $or;
	return tree.find(query);
};

// Shuttle.can(tree, object, subject) => Boolean
Shuttle.can = function(tree, object, subject) {
	if (!object) return false;
	return !!Shuttle.get(tree, object, subject).count();
};

CollectionExtensions.addExtension(function (name, options) {
	this.attachRefs();
});

if (Meteor.isClient) {
	Template.registerHelper('Shuttle', function(target) {
		return Shuttle;
	});
}

if (Meteor.isServer) {
	Mongo.Collection.prototype.attachSecure = function(Tree, field) {
		var Collection = this;
	
		var schema = {};
		schema[field] = { type: [Refs.Schema], optional: true };
		Shuttle.Posts.attachSchema(schema);
	
		Collection.deny({
			insert: function (userId, document) {
				if (field in document)
					throw new Meteor.Error('Users can not insert document with secure fields.');
			},
			update: function (userId, document, fieldNames, modifier) {
				if (lodash.includes(fieldNames, field))
					throw new Meteor.Error('Users can not update secure fields.');
			}
		});
		
		this.mirrorTargetsFromTree(Tree, field);
	
		Collection.before.find(function (userId, selector, options) {
			if (!userId) userId = 'guest';
			if (!('$and' in selector)) selector.$and = [];
			var $or = [];
			// var subjects = Shuttle.Subjects.find({ '_source.collection': Meteor.users._name, '_source.id': userId }).fetch();
			// for (var s in subjects) {
			// 	var push = {};
			// 	push[field+'.collection'] = subjects[s]._target.collection;
			// 	push[field+'.id'] = subjects[s]._target.id;
			// 	$or.push(push);
			// }
			var push = {};
			push[field+'.collection'] = Meteor.users._name;
			push[field+'.id'] = userId;
			$or.push(push);
			selector.$and.push({ $or: $or });
		});
	};
}

Template.registerHelper('Shuttle', function() { return Shuttle; });
Template.registerHelper('Meteor', function() { return Meteor; });

if (Meteor.isServer) {
	var guest = Meteor.users.findOne({ _id: 'guest' });
	if (!guest) {
		Meteor.users.insert({
			_id: 'guest'
		})
	}
}