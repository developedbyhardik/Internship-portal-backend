import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    //Create refresh token
    //Session Id (sessionToken)
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSignature
    );
    //Create Access Token
    //Session Id (sessionToken) ,User Id
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWTSignature
    );

    // Return Refresh token & Access Token
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
}
