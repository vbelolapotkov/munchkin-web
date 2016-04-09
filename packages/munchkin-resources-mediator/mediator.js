Mediator = {
    channels: {},
    publish: function(name, options) {
        this.channels[name].options = options;
        //do not triger deps when reset channel;
        if(!options) return;
        this.channels[name].deps.changed();
    },
    subscribe: function(name) {
        if (!this.channels[name]) {
            this.channels[name] = {
                deps: new Tracker.Dependency(),
                options: null
            };
        }
        this.channels[name].deps.depend();
        return this.channels[name].options;
    },
    reset: function (name) {
        this.channels[name].options = null;
    }
};