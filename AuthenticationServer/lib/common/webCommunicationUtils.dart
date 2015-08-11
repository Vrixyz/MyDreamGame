import 'dart:io';
import 'dart:async';
import 'dart:convert';

Future<String> getAsString(Uri uri) {

  HttpClient client = new HttpClient();

  return client.getUrl(uri)

  .then((HttpClientRequest request) => request.close())

  .then((HttpClientResponse resp) => resp.transform(UTF8.decoder).fold(new StringBuffer(), (buf, next) {

    buf.write(next);

    return buf;

  }))
  .then((StringBuffer buf) => buf.toString());

}