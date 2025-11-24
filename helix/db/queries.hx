QUERY createUser(name: String, email: String) =>
  user <- AddN<User>({name: name, email: email})
  RETURN user

QUERY getUser(name: String) =>
  user <- N<User>({name: name})
  RETURN user