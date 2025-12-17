const cron = require("node-cron");
const Lead = require("../models/Lead");

cron.schedule("*/5 * * * *", async () => {
  console.log("Running CRM sync job...");

  const leads = await Lead.find({
    status: "Verified",
    syncedToCRM: false
  });

  for (const lead of leads) {
    console.log(
      `[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`
    );

    lead.syncedToCRM = true;
    await lead.save();
  }
});
