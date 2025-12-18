const { workerData, parentPort } = require('worker_threads');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const path = require('path');


const Agent = require('../models/Agent');
const User = require('../models/User');
const Account = require('../models/Account');
const LOB = require('../models/LOB');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');


mongoose.connect(process.env.MONGO_URI);


const workbook = XLSX.readFile(workerData.filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rows = XLSX.utils.sheet_to_json(sheet);

const parseNumber = value => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

(async () => {
  try {
    for (const row of rows) {

      await Agent.findOneAndUpdate(
        { agentName: row.agent },
        {
          agentName: row.agent,
          agencyId: row.agency_id
        },
        { upsert: true, new: true }
      );


      const user = await User.findOneAndUpdate(
        { email: row.email },
        {
          firstName: row.firstname,
          email: row.email,
          dob: row.dob ? new Date(row.dob) : null,
          address: row.address,
          city: row.city,
          state: row.state,
          zipCode: row.zip,
          phoneNumber: row.phone,
          gender: row.gender,
          userType: row.userType,
          primaryApplicant: row.primary === 'true' || row.primary === true,
          applicantId: row['Applicant ID']
        },
        { upsert: true, new: true }
      );

      const account = await Account.findOneAndUpdate(
        {
          accountName: row.account_name,
          userId: user._id
        },
        {
          accountName: row.account_name,
          accountType: row.account_type,
          userId: user._id
        },
        { upsert: true, new: true }
      );


      const lob = await LOB.findOneAndUpdate(
        { category_name: row.category_name },
        { category_name: row.category_name },
        { upsert: true, new: true }
      );

      const carrier = await Carrier.findOneAndUpdate(
        { company_name: row.company_name },
        { company_name: row.company_name },
        { upsert: true, new: true }
      );


      await Policy.findOneAndUpdate(
        { policyNumber: row.policy_number },
        {
          policyNumber: row.policy_number,
          policyType: row.policy_type,
          policyMode: row.policy_mode,
          policyStartDate: new Date(row.policy_start_date),
          policyEndDate: new Date(row.policy_end_date),

          premiumAmountWritten: parseNumber(row.premium_amount_written),
          premiumAmount: parseNumber(row.premium_amount),
          producer: row.producer,
          csr: row.csr,
          hasActivePolicy:
            row['hasActive ClientPolicy'] === true ||
            row['hasActive ClientPolicy'] === 'true',
          userId: user._id,
          accountId: account._id,
          lobId: lob._id,
          companyId: carrier._id
        },
        { upsert: true, new: true }
      );

    }

    parentPort.postMessage({
      status: 'success',
      message: 'CSV/XLSX data uploaded successfully'
    });

    process.exit(0);
  } catch (error) {
    parentPort.postMessage({
      status: 'error',
      message: error.message
    });
    process.exit(1);
  }
})();
