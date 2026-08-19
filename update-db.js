const { MongoClient } = require('mongodb');
async function run() {
  const uri = "mongodb+srv://singhyash9631_db_user:Yashveer2003@cluster0.0mz9pxn.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test');
    const result = await db.collection('portfolios').updateOne(
      {},
      { $set: { heroImage: "/cutout.png" } }
    );
    console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
