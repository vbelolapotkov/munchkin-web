Mediator = {
    channels: {},
    publish: function (name) {
        if(!this.channels[name]) return;
        this.channels[name].set(_.toArray(arguments));
    },
    subscribe: function (name) {
        if (!this.channels[name]) {
            this.channels[name] = new ReactiveVar(null);
        }
        return this.channels[name].get();
    }
};