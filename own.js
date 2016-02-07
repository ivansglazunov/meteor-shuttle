Shuttle.Own = new Mongo.Collection('shuttle:own');

Shuttle.Own.attachRefs();
Shuttle.Own.attachTree();

Shuttle.Own.deny({
	insert: function(userId, _own) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var own = Shuttle.Own._transform(_own);
		var source = own.source();

		if (!Shuttle.Own.find(lodash.merge(source.Ref('_source'))).count())
			return false;

		if (Shuttle.can(Shuttle.Owning, source, user))
			return false;

		throw new Meteor.Error('You can not insert own links for '+JSON.stringify(source.Ref()));
	},
	remove: function(userId, _own) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var own = Shuttle.Own._transform(_own);
		var source = own.source();

		if (!Shuttle.can(Shuttle.Owning, source, user))
			throw new Meteor.Error('You can not owning own link '+JSON.stringify(own.Ref()));

		if (Shuttle.Own.find(lodash.merge(source.Ref('_source'))).count() <= 1)
			throw new Meteor.Error('You can not remove last own link '+JSON.stringify(own.Ref()));

		return false;
	}
});