import jwt from "jsonwebtoken";

const { JWT_SIGNATURE } = process.env;

export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../data/data.js");

    if (request?.cookies?.refreshToken) {
      //if refreshToken
      const { refreshToken } = request.cookies;

      //decode accessToken
      const decodedRefreshToken = jwt.verify(refreshToken, JWT_SIGNATURE);

      //Delete session from database
      await session.deleteOne({
        sessionToken: decodedRefreshToken?.sessionToken,
      });

      //Remove the Cookie
      const logoutCookieOption = {
        httpOnly: true,
        path: "/",
        domain: 'localhost',
      };
      reply
        .clearCookie("refreshToken", logoutCookieOption)
        .clearCookie("accessToken", logoutCookieOption);
    }
  } catch (error) {
    throw new Error(error);
  }
}
