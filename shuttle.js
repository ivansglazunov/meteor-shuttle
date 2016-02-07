Shuttle = {};

// Shuttle.get(tree, object, subject) => Cursor
Shuttle.get = function(tree, object, subject) {
	if (!subject) throw new Meteor.Error('Shuttle only for subjects');
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
	return !!Shuttle.get(tree, object, subject).count();
};

CollectionExtensions.addExtension(function (name, options) {
	this.attachRefs();
});