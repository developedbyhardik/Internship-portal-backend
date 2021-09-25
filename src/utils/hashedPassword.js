import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;

export async function hashedPassword(password) {
  //generate salt
  const salt = await genSalt(10);

  //hash with salt
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}
