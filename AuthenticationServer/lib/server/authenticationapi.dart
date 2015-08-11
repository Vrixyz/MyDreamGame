library authentication.server;

import 'package:rpc/rpc.dart';
import 'dart:convert';

import '../common/Link.dart';
import '../common/Account.dart';
import '../common/webCommunicationUtils.dart';
import 'storageconnection.dart';

// This class defines the interface that the server provides.
@ApiClass(version: 'v1')
class AuthenticationApi {
  final List<Account> _userAccounts = [];
  StorageConnection storageConnection = null;

  AuthenticationApi() {
    // TODO: connect to db (create class) (REMINDER: don't make the ip/password public)
    storageConnection = new StorageConnection();
  }

  // Returns a list of the created accounts
  @ApiMethod(path: 'accounts')
  List<Account> listAccounts() {
    return _userAccounts;
  }

  @ApiMethod(method: 'DELETE', path: 'account/{id}')
  Account firePirate(int id) {
    // TODO: properly delete
    /*var pirate = new Pirate()
      ..name = Uri.decodeComponent(name)
      ..appellation = Uri.decodeComponent(appellation);
    var pirateName = pirate.toString();
    if (!_pirateCrew.containsKey(pirateName)) {
      throw new NotFoundError('Could not find pirate \'$pirate\'!' +
      'Maybe they\'ve abandoned ship!');
    }*/
    return _userAccounts.remove(_userAccounts.first);
  }

  // google client auth api callback
  @ApiMethod(method: 'POST', path: 'googleConnect')
  GameSession googleConnect(Link link) async {
    print(link.provider);
    print(link.data);
    String token = link.data;
    Account accountConnecting;

    // get confirmation from google
    // TODO: make the provider abstract (inside Link ?)
    await getAsString(Uri.parse(
            'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=$token'))
        .then((String value) {
      print(value);
      Map data = JSON.decode(value);
      if (data["audience"] != "942079075130-01hs0upc7v40vg5jk8non8bj1jeffp21.apps.googleusercontent.com") {
        throw("Bad audience for given token.");
      }
      print(data["expires_in"]);
      link.userId = data["user_id"];
      print(link.provider);
    }).catchError((err) => print("Error $err"));

    // try to get account from db
    await storageConnection.retrieveAccountWith(externalId:link.userId, provider:"google")
    .then((account) {
      if (account != null) {
        print('id of existing account: ${account.id}');
        accountConnecting = account;
      }
    });
    // if no existing account, create it
    if (accountConnecting == null) {
      int newAccountId;
      await storageConnection.createFreshAccount().then((retId) {
        newAccountId = retId;
      });
      storageConnection.createLink(link, newAccountId);
    }

    print("end");
    // TODO: session configuration
    GameSession gs = new GameSession();
    gs.account = accountConnecting;
    return gs;
  }
}
