library authentication.account;

import "Link.dart";
import "Game.dart";

// This class represents a player

// This class is used to send data back and forth between the
// client and server. It is automatically serialized and
// deserialized by the RPC package.
class Account {
  int id;
  String name;
  List<Link> links;
  List<Game> games;

  // A message class must have a default constructor taking no
  // arguments.
  Account();

  Account.testAccount(this.name);
  Account.init(this.id, this.name, this.links, this.games);

  // TODO: absorb another account
  bool absorb(Account account) {
    return false;
  }

  // TODO: better tostring method ?
  String toString() => name.isEmpty ? '' : '$name';
}

class GameSession {
  Account account;
  String errorMessage;
}