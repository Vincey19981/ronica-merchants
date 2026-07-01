export const canAccessOrganizationRecord = (user, orgId) =>
  user.roles.includes("admin") || user.roles.includes("compliance") || (!!orgId && orgId === user.organization?.id);

export const canReviewOrganizationRecords = (user) => user.roles.includes("admin") || user.roles.includes("compliance");

export const canAccessTender = (user, tender) =>
  user.roles.includes("admin") || !tender.orgId || tender.orgId === user.organization?.id;
