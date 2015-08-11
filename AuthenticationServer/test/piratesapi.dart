import 'package:test/test.dart';

import '../../lib/server/piratesapi.dart';

void main() {

  test("Normal behaviour of piratesApi", () {

    PiratesApi piratesApi = new PiratesApi();
    var crew = piratesApi.listPirates();

    test("Initial crew should include a captain", () {
      expect(crew.length, equals(1));
    });
    test("Captain's name should be awesome", () {
      expect(crew[0].name, isNotNull);
    });
  });
}
