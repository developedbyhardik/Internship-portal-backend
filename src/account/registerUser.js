import { hashedPassword } from "../utils/hashedPassword.js";

export async function registerUser(name, email, password) {
  try {
    const { user } = await import("../data/data.js");

    const hashPassword = await hashedPassword(password);

    const checkUserExist = await user.findOne({ "email.address": email });
    //Store in database
    if (!checkUserExist) {
      const result = await user.insertOne({
        name,
        email: {
          address: email,
          verified: false,
        },
        password: hashPassword,
      });
      //Return user From Database
      return {
        registered: true,
        message: "You are successfully registered",
      };
    }

    return {
      registered: false,
      message: "User Already Exist",
    };
  } catch (error) {
    console.error(error);
  }
}
