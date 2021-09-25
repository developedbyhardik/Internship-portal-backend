import mongo from "mongodb";

const { MongoClient } = mongo;

const url = process.env.MONGO_URL;

export const client = new MongoClient(url, { useNewUrlParser: true });

export async function connectDB() {
  try {
    await client.connect();
    //Confirm Connection
    await client.db("admin").command({ ping: 1 });
    console.log("⚡⚡ Connected Successfully");
  } catch (error) {
    console.error(error);
    // If there is problem then close Connection to db
    await client.close();
  }
}
