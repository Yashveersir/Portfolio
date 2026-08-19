const { MongoClient } = require('mongodb');
async function run() {
  const uri = "mongodb+srv://singhyash9631_db_user:Yashveer2003@cluster0.0mz9pxn.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const listDbs = await adminDb.listDatabases();
    console.log("Databases:");
    for (let db of listDbs.databases) {
      console.log(`- ${db.name}`);
      if (db.name !== 'admin' && db.name !== 'local') {
         const cols = await client.db(db.name).listCollections().toArray();
         for (let c of cols) {
           console.log(`  - Collection: ${c.name}`);
           if (c.name.toLowerCase().includes('portfolio')) {
             const doc = await client.db(db.name).collection(c.name).findOne({});
             console.log("    Found doc:", JSON.stringify(doc).slice(0,200));
           }
         }
      }
    }
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
