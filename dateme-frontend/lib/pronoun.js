const HIS_HER_THEIR = {
  male: "his",
  female: "her",
  other: "their"
};

const HIM_HER_THEM = {
  male: "him",
  female: "her",
  other: "them"
};

const HE_SHE_THEY = {
  male: "he",
  female: "she",
  other: "they"
};

export const hisHerTheir = sex => {
  return HIS_HER_THEIR[sex] || "their";
};

export const himHerThem = sex => {
  return HIM_HER_THEM[sex] || "them";
};

export const heSheThey = sex => {
  return HE_SHE_THEY[sex] || "they";
};
