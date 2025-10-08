import passport from "passport";
import { Strategy } from "passport-local";

const mockUsers = [
  { username: "mnsnnd", password: "mnadsbcd" },
  { username: "testuser1", password: "password123" },
  { username: "anotheruser", password: "securePass" },
  // Add more user objects as needed
];

export default passport.use(
  new Strategy((name, password, done) => {
    try {
      const findUser = mockUsers.find((user) => user.username == name);
      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password)
        throw new Error("invalid credentials");
      console.log(findUser)
      return done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
