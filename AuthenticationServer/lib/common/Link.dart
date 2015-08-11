library authentication.link;

// This class is used to send data back and forth between the
// client and server. It is automatically serialized and
// deserialized by the RPC package.
class Link {
  String provider; // facebook / steam / google / ...
  String data; // minimal information to validate the link
  String userId;
  // A message class must have a default constructor taking no
  // arguments.
  Link() {

  }
}