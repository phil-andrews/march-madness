export type TeamSeedRecord = {
  assignedNumber: number;
  name: string;
  seed: number;
  slotLabel?: string;
  isFirstFourSlot?: boolean;
  firstFourOpponent?: string;
  aliases?: string[];
};

function team(
  assignedNumber: number,
  name: string,
  seed: number,
  extra: Omit<TeamSeedRecord, "assignedNumber" | "name" | "seed"> = {},
): TeamSeedRecord {
  return {
    assignedNumber,
    name,
    seed,
    slotLabel: name,
    ...extra,
  };
}

export const TEAMS_2026: TeamSeedRecord[] = [
  team(1, "Arizona", 1),
  team(2, "Duke", 1),
  team(3, "Florida", 1),
  team(4, "Michigan", 1),
  team(5, "Houston", 2),
  team(6, "Iowa State", 2),
  team(7, "Purdue", 2),
  team(8, "UConn", 2, { aliases: ["Connecticut"] }),
  team(9, "Gonzaga", 3),
  team(10, "Illinois", 3),
  team(11, "Michigan State", 3),
  team(12, "Virginia", 3),
  team(13, "Alabama", 4),
  team(14, "Arkansas", 4),
  team(15, "Kansas", 4),
  team(16, "Nebraska", 4),
  team(17, "St. John's", 5, {
    aliases: ["St Johns", "Saint Johns", "Saint John's"],
  }),
  team(18, "Texas Tech", 5),
  team(19, "Vanderbilt", 5),
  team(20, "Wisconsin", 5),
  team(21, "BYU", 6),
  team(22, "Louisville", 6),
  team(23, "North Carolina", 6, { aliases: ["UNC"] }),
  team(24, "Tennessee", 6),
  team(25, "UCLA", 7),
  team(26, "Kentucky", 7),
  team(27, "Miami", 7, { aliases: ["Miami (FL)"] }),
  team(28, "St. Mary's", 7, {
    aliases: ["St Marys", "Saint Mary's", "Saint Marys"],
  }),
  team(29, "Ohio State", 8, { aliases: ["Ohio St"] }),
  team(30, "Clemson", 8),
  team(31, "Georgia", 8),
  team(32, "Villanova", 8),
  team(33, "TCU", 9),
  team(34, "Iowa", 9),
  team(35, "St. Louis", 9, {
    aliases: ["Saint Louis", "Saint Louis University"],
  }),
  team(36, "Utah State", 9),
  team(37, "UCF", 10),
  team(38, "Missouri", 10),
  team(39, "Santa Clara", 10),
  team(40, "Texas A&M", 10, { aliases: ["Texas AM"] }),
  team(41, "South Florida", 11, { aliases: ["USF"] }),
  team(42, "VCU", 11),
  team(43, "NC State", 11, {
    isFirstFourSlot: true,
    firstFourOpponent: "Texas",
    slotLabel: "Texas/NC State",
    aliases: ["NC State/Texas", "Texas / NC State", "NC State / Texas"],
  }),
  team(44, "Miami (OH)", 11, {
    isFirstFourSlot: true,
    firstFourOpponent: "SMU",
    slotLabel: "SMU/Miami (OH)",
    aliases: [
      "SMU/Miami OH",
      "SMU / Miami (OH)",
      "Miami OH",
      "Miami (Ohio)",
    ],
  }),
  team(45, "Akron", 12),
  team(46, "High Point", 12),
  team(47, "McNeese", 12),
  team(48, "Northern Iowa", 12),
  team(49, "Cal Baptist", 13, { aliases: ["California Baptist"] }),
  team(50, "Hawaii", 13, { aliases: ["Hawai'i"] }),
  team(51, "Hofstra", 13),
  team(52, "Troy", 13),
  team(53, "Kennesaw St.", 14, { aliases: ["Kennesaw State"] }),
  team(54, "North Dakota St.", 14, { aliases: ["North Dakota State"] }),
  team(55, "Penn", 14, { aliases: ["Pennsylvania"] }),
  team(56, "Wright State", 14),
  team(57, "Furman", 15),
  team(58, "Idaho", 15),
  team(59, "Queens", 15, { aliases: ["Queens University"] }),
  team(60, "Tennessee State", 15),
  team(61, "Long Island", 16, { aliases: ["LIU", "LIU Brooklyn"] }),
  team(62, "Siena", 16),
  team(63, "Howard", 16, {
    isFirstFourSlot: true,
    firstFourOpponent: "UMBC",
    slotLabel: "Howard/UMBC",
    aliases: ["UMBC/Howard", "Howard / UMBC", "UMBC / Howard"],
  }),
  team(64, "Prairie View", 16, {
    isFirstFourSlot: true,
    firstFourOpponent: "Lehigh",
    slotLabel: "Prairie View/Lehigh",
    aliases: [
      "Lehigh/Prairie View",
      "Prairie View A&M",
      "Prairie View AM",
      "Lehigh / Prairie View",
    ],
  }),
];

export const TEAMS_2026_BY_ASSIGNED_NUMBER = new Map(
  TEAMS_2026.map((seedRecord) => [seedRecord.assignedNumber, seedRecord]),
);
