const crypto = require('crypto');
const Employee = require('../models/Employee');

const INVITE_CODE_BYTES = 6;
const APPROVED_STATUS = 'APPROVED';

function normalizeInviteCode(value) {
  return String(value || '').trim().toUpperCase();
}

async function createUniqueInviteCode() {
  let code = '';
  let exists = true;
  while (exists) {
    code = crypto.randomBytes(INVITE_CODE_BYTES).toString('hex').toUpperCase();
    exists = Boolean(await Employee.exists({ inviteCode: code }));
  }
  return code;
}

async function ensureInviteCode(employee) {
  if (employee.inviteCode) return employee.inviteCode;
  const code = await createUniqueInviteCode();
  employee.inviteCode = code;
  await employee.save();
  return code;
}

async function resolveSponsorByInviteCode(inviteCode) {
  const code = normalizeInviteCode(inviteCode);
  if (!code) return null;
  const sponsor = await Employee.findOne({ inviteCode: code }).populate(
    'userId',
    'fullName isActive approvalStatus role'
  );
  if (!sponsor || !sponsor.userId) return null;
  if (sponsor.userId.isActive === false) return null;
  if (sponsor.userId.approvalStatus && sponsor.userId.approvalStatus !== APPROVED_STATUS) {
    return null;
  }
  return sponsor;
}

function publicSponsorPayload(sponsor) {
  return {
    inviteCode: sponsor.inviteCode,
    sponsorName: sponsor.userId?.fullName || 'House & Sky Agent',
    employeeCode: sponsor.employeeCode,
    currentRank: sponsor.currentRank
  };
}

module.exports = {
  normalizeInviteCode,
  ensureInviteCode,
  resolveSponsorByInviteCode,
  publicSponsorPayload
};
