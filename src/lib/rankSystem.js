export const rankSystem = [
  { id: 'newbie', name: 'Newbie', icon: 'fa-user-circle', threshold: 0, color: 'text-gray-400' },
  { id: 'member', name: 'Member', icon: 'fa-user', threshold: 50, color: 'text-green-400' },
  { id: 'advanced', name: 'Advanced', icon: 'fa-medal', threshold: 200, color: 'text-blue-400' },
  { id: 'expert', name: 'Expert', icon: 'fa-star', threshold: 500, color: 'text-yellow-400' },
  { id: 'moderator', name: 'Moderator', icon: 'fa-shield-alt', threshold: 1000, color: 'text-purple-400' },
  { id: 'admin', name: 'Admin', icon: 'fa-crown', threshold: Infinity, color: 'text-red-400' },
];

export const getRankDetails = (rankId) => {
  return rankSystem.find(r => r.id === rankId) || rankSystem[0];
};

export const checkRankUp = (currentRankId, reputation) => {
  const currentRankIndex = rankSystem.findIndex(r => r.id === currentRankId);
  if (currentRankIndex === -1 || currentRankIndex === rankSystem.length - 1) {
    return currentRankId;
  }

  const nextRank = rankSystem[currentRankIndex + 1];
  if (reputation >= nextRank.threshold) {
    return nextRank.id;
  }

  return currentRankId;
};