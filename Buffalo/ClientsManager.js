var Util = require("util");


function ClientsManager() {
    var clients = {};
    this.addClient = function(client) {
        clients[client.id] = client;
    };
    this.getPlayer = function(id) {
        return clients[id];
    };
    this.removePlayer = function(id) {
        delete clients.id;
    };
};

var manager = new ClientsManager();

module.exports = manager;