// This is a generated file (see the discoveryapis_generator project).

library server_code_lab.authenticationApi.client;

import 'dart:core' as core;
import 'dart:async' as async;
import 'dart:convert' as convert;

import 'package:_discoveryapis_commons/_discoveryapis_commons.dart' as commons;
import 'package:http/http.dart' as http;
import 'package:server_code_lab/common/Account.dart';
import 'package:server_code_lab/common/Game.dart';
import 'package:server_code_lab/common/Link.dart';
export 'package:_discoveryapis_commons/_discoveryapis_commons.dart' show
    ApiRequestError, DetailedApiRequestError;

const core.String USER_AGENT = 'dart-api-client authenticationApi/v1';

class AuthenticationApi {

  final commons.ApiRequester _requester;

  AuthenticationApi(http.Client client, {core.String rootUrl: "http://localhost:8080/", core.String servicePath: "authenticationApi/v1/"}) :
      _requester = new commons.ApiRequester(client, rootUrl, servicePath, USER_AGENT);

  /**
   * Request parameters:
   *
   * [id] - Path parameter: 'id'.
   *
   * Completes with a [Account].
   *
   * Completes with a [commons.ApiRequestError] if the API endpoint returned an
   * error.
   *
   * If the used [http.Client] completes with an error when making a REST call,
   * this method will complete with the same error.
   */
  async.Future<Account> firePirate(core.int id) {
    var _url = null;
    var _queryParams = new core.Map();
    var _uploadMedia = null;
    var _uploadOptions = null;
    var _downloadOptions = commons.DownloadOptions.Metadata;
    var _body = null;

    if (id == null) {
      throw new core.ArgumentError("Parameter id is required.");
    }

    _url = 'account/' + commons.Escaper.ecapeVariable('$id');

    var _response = _requester.request(_url,
                                       "DELETE",
                                       body: _body,
                                       queryParams: _queryParams,
                                       uploadOptions: _uploadOptions,
                                       uploadMedia: _uploadMedia,
                                       downloadOptions: _downloadOptions);
    return _response.then((data) => AccountFactory.fromJson(data));
  }

  /**
   * [request] - The metadata request object.
   *
   * Request parameters:
   *
   * Completes with a [GameSession].
   *
   * Completes with a [commons.ApiRequestError] if the API endpoint returned an
   * error.
   *
   * If the used [http.Client] completes with an error when making a REST call,
   * this method will complete with the same error.
   */
  async.Future<GameSession> googleConnect(Link request) {
    var _url = null;
    var _queryParams = new core.Map();
    var _uploadMedia = null;
    var _uploadOptions = null;
    var _downloadOptions = commons.DownloadOptions.Metadata;
    var _body = null;

    if (request != null) {
      _body = convert.JSON.encode(LinkFactory.toJson(request));
    }

    _url = 'googleConnect';

    var _response = _requester.request(_url,
                                       "POST",
                                       body: _body,
                                       queryParams: _queryParams,
                                       uploadOptions: _uploadOptions,
                                       uploadMedia: _uploadMedia,
                                       downloadOptions: _downloadOptions);
    return _response.then((data) => GameSessionFactory.fromJson(data));
  }

  /**
   * Request parameters:
   *
   * Completes with a [core.List<Account>].
   *
   * Completes with a [commons.ApiRequestError] if the API endpoint returned an
   * error.
   *
   * If the used [http.Client] completes with an error when making a REST call,
   * this method will complete with the same error.
   */
  async.Future<core.List<Account>> listAccounts() {
    var _url = null;
    var _queryParams = new core.Map();
    var _uploadMedia = null;
    var _uploadOptions = null;
    var _downloadOptions = commons.DownloadOptions.Metadata;
    var _body = null;


    _url = 'accounts';

    var _response = _requester.request(_url,
                                       "GET",
                                       body: _body,
                                       queryParams: _queryParams,
                                       uploadOptions: _uploadOptions,
                                       uploadMedia: _uploadMedia,
                                       downloadOptions: _downloadOptions);
    return _response.then((data) => data.map((value) => AccountFactory.fromJson(value)).toList());
  }

}



class AccountFactory {
  static Account fromJson(core.Map _json) {
    var message = new Account();
    if (_json.containsKey("games")) {
      message.games = _json["games"].map((value) => GameFactory.fromJson(value)).toList();
    }
    if (_json.containsKey("id")) {
      message.id = _json["id"];
    }
    if (_json.containsKey("links")) {
      message.links = _json["links"].map((value) => LinkFactory.fromJson(value)).toList();
    }
    if (_json.containsKey("name")) {
      message.name = _json["name"];
    }
    return message;
  }

  static core.Map toJson(Account message) {
    var _json = new core.Map();
    if (message.games != null) {
      _json["games"] = message.games.map((value) => GameFactory.toJson(value)).toList();
    }
    if (message.id != null) {
      _json["id"] = message.id;
    }
    if (message.links != null) {
      _json["links"] = message.links.map((value) => LinkFactory.toJson(value)).toList();
    }
    if (message.name != null) {
      _json["name"] = message.name;
    }
    return _json;
  }
}

class GameFactory {
  static Game fromJson(core.Map _json) {
    var message = new Game();
    if (_json.containsKey("id")) {
      message.id = _json["id"];
    }
    if (_json.containsKey("name")) {
      message.name = _json["name"];
    }
    return message;
  }

  static core.Map toJson(Game message) {
    var _json = new core.Map();
    if (message.id != null) {
      _json["id"] = message.id;
    }
    if (message.name != null) {
      _json["name"] = message.name;
    }
    return _json;
  }
}

class GameSessionFactory {
  static GameSession fromJson(core.Map _json) {
    var message = new GameSession();
    if (_json.containsKey("account")) {
      message.account = AccountFactory.fromJson(_json["account"]);
    }
    if (_json.containsKey("errorMessage")) {
      message.errorMessage = _json["errorMessage"];
    }
    return message;
  }

  static core.Map toJson(GameSession message) {
    var _json = new core.Map();
    if (message.account != null) {
      _json["account"] = AccountFactory.toJson(message.account);
    }
    if (message.errorMessage != null) {
      _json["errorMessage"] = message.errorMessage;
    }
    return _json;
  }
}

class LinkFactory {
  static Link fromJson(core.Map _json) {
    var message = new Link();
    if (_json.containsKey("data")) {
      message.data = _json["data"];
    }
    if (_json.containsKey("provider")) {
      message.provider = _json["provider"];
    }
    if (_json.containsKey("userId")) {
      message.userId = _json["userId"];
    }
    return message;
  }

  static core.Map toJson(Link message) {
    var _json = new core.Map();
    if (message.data != null) {
      _json["data"] = message.data;
    }
    if (message.provider != null) {
      _json["provider"] = message.provider;
    }
    if (message.userId != null) {
      _json["userId"] = message.userId;
    }
    return _json;
  }
}

