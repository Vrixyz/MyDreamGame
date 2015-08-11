import 'package:test/test.dart';

import '../../lib/server/authenticationapi.dart';
import '../../lib/common/Link.dart';
import '../../lib/common/Account.dart';

void main() {
    AuthenticationApi authApi = new AuthenticationApi();
    var users = authApi.listAccounts();

    test("Initial user list should be empty", () {
      expect(users.length, equals(0));
    });

    test("Connect with a valid link should return a valid Account", () {
      Account account = authApi.connect(new Link());
      expect(account.name, isNotEmpty);
    });
}