Shuttle.Rights = new Mongo.Collection('shuttle:rights');

Shuttle.Rights.attachRefs();
Shuttle.Rights.attachTree();
Shuttle.Rights.attachSchema(Shuttle.insertedSchema);

Shuttle.Rights.deny({
	insert: function(userId, _right) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var right = Shuttle.Rights._transform(_right);
		var source = right.source();

		if (!Shuttle.Rights.find(lodash.merge(source.Ref('_source'))).count())
			return false;

		if (Shuttle.can(Shuttle.Owning, source, user))
			return false;

		throw new Meteor.Error('You can not insert right links for '+JSON.stringify(source.Ref()));
	},
	remove: function(userId, _right) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var right = Shuttle.Rights._transform(_right);
		var source = right.source();

		if (!Shuttle.can(Shuttle.Owning, source, user))
			throw new Meteor.Error('You can not owninging right link '+JSON.stringify(right.Ref()));

		if (Shuttle.Rights.find(lodash.merge(source.Ref('_source'))).count() <= 1)
			throw new Meteor.Error('You can not remove last right link '+JSON.stringify(right.Ref()));

		return false;
	}
});