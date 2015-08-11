import 'package:postgresql/postgresql.dart';
import '../common/Link.dart';
import '../common/Account.dart';
import 'dart:async';

class StorageConnection {
  Connection connection = null;

  StorageConnection([cb(StorageConnection cnx) = null]) {
    // placeholder DB (Don't put
    var uri = 'postgres://TiTi:@localhost:5432/TiTi';
    print("Attempting connection...");
    connect(uri).then((conn) {
      print("Connected.");
      connection = conn;
      if (cb)
        cb(this);
    });
    // TODO: handle failure !

  }
  // returns the id of the account



  // TODO: return the new account
  Future<int> createFreshAccount() async {
    if (!connection == null) {
      throw "no connection";
    }
    var idToReturnList = null;
    //TODO: catch and treat error
    idToReturnList = await connection.query("""
    INSERT INTO account(id, date_created) VALUES (default, NOW()) returning id;
    """).toList();
    print(idToReturnList);
    return idToReturnList[0][0];
  }

  Future<Account> retrieveAccountWith({int externalId, String provider}) async{
    if (!connection == null) {
      throw "no connection";
    }
    print("""
    SELECT id_account FROM link
    WHERE id_link_type = (select id from link_type where link_type.name = '$provider')
    and external_id = '$externalId';
    """);
    // TODO: caching of nested query ?
    Account existingAccount = null;
    await connection.query("""
    SELECT id_account FROM link
    WHERE id_link_type = (select id from link_type where link_type.name = '$provider')
    and external_id = '$externalId';
    """).map((row){
      print("row: $row");
      Account newAccount = new Account.testAccount("test");
      newAccount.id = row[0];
      return newAccount;
    }).toList().then((List<Account> accounts){ // it can only be one due to db constraints
      existingAccount = accounts[0];
    }).catchError((err){
      print(err);
    });
    print("done");
    return existingAccount;
  }

  Future<bool> createLink(Link link, int accountId) async {
    if (!connection == null) {
      throw "no connection";
    }
    String externalId = link.userId;
    String provider = link.provider;
  print("""
    INSERT INTO link(id_account, external_id, id_link_type) VALUES (${accountId}, $externalId, (select id from link_type where link_type.name = '$provider' ) );
    """);

    await connection.execute("""
    INSERT INTO link(id_account, external_id, id_link_type) VALUES (${accountId}, $externalId, (select id from link_type where link_type.name = '$provider' ) );
    """).then((rowsAffected) {
      print(rowsAffected);
    }).catchError((err) {
      print(err);
    });
    return true; // FIXME: handle errors
  }
}