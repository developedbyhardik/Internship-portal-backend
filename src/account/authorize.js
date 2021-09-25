import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export async function authorizeUser(email, password) {
  try {
    //Import user collaction from Database
    const { user } = await import("../data/data.js");

    //Finding out the user
    const userData = await user.findOne({ "email.address": email });

    if (userData) {
      //getting saved password in the database
      const savedPassword = userData.password;

      //Compare bath passwords
      const isAuthorized = await compare(password, savedPassword);

      //Return the boolean

      return {
        isAuthorized,
        userId: userData._id,
        userName: userData.name,
      };
    }
    return {
      isAuthorized:false,
      userId: null,
      userName: null,
    };
  } catch (error) {
    console.error(error);
  }
}
