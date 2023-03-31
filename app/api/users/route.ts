import { sampleCharacter } from "@/util/characters";
import { MongoClient } from "mongodb";

export async function GET(request: Request) {
  const method = request.method;

  // connect to mongo db
  const client = await MongoClient.connect(
    process.env.NEXT_PUBLIC_MONGODB_URI as string
  );

  const db = client.db();

  const usersCollection = db.collection("sample_airbnb");

  // get all users
  const users = await usersCollection.find().toArray();

  const sampleData = sampleCharacter

  return new Response(JSON.stringify(users), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
}

export async function POST(request: Request) {
  const method = request.method;

  // connect to mongo db
  const client = await MongoClient.connect(
    process.env.NEXT_PUBLIC_MONGODB_URI as string
  );
  const db = client.db();
  const usersCollection = db.collection("users");

  // create user
  const newUser = await usersCollection.insertOne({
    name: "Emily Park",
    email: "emily.park@berkeley.edu",
  });

  return new Response(
    JSON.stringify({
      user: newUser,
      token: process.env.NEXT_PUBLIC_MONGODB_URI as string,
    })
  );
}
