import { randomBytes } from "crypto";

export async function createSession(userId, connection) {
  try {
    //Generate Session Token
    const sessionToken = randomBytes(43).toString("hex");

    //Retrieve connection Information
    const { ip, userAgent } = connection;

    //Database insert for session
    const { session } = await import("../data/data.js");
    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    //Return SessionToken
    return sessionToken;
  } catch (error) {
    throw new Error("Session Creation Failed");
  }
}
