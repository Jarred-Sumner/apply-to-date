import localForage from "localforage";

if (typeof window !== "undefined") {
  localForage.config({
    name: "applytodate",
    version: 1.0,
    storeName: "config"
  });
}

function randId() {
  return Math.random()
    .toString(36)
    .substr(2, 10);
}

const KEYS = {
  FULL_STORY: "fullstoryid",
  DISCOVERED_PROFILES: "DISCOVERED_PROFILES_"
};

export default class Storage {
  static async fullstoryId() {
    let id = await localForage.getItem(KEYS.FULL_STORY);
    if (!id) {
      id = randId();
      localForage.setItem(KEYS.FULL_STORY, id);
    }

    return id;
  }

  static async discoveredProfiles() {
    const profiles = await localForage.getItem(KEYS.DISCOVERED_PROFILES);

    return profiles || new Set();
  }

  static async addDiscoveredProfile(profileId) {
    const profiles = await Storage.discoveredProfiles();
    profiles.add(profileId);

    return localForage.setItem(KEYS.DISCOVERED_PROFILES, profiles);
  }

  static getItem(key) {
    if (typeof window === "undefined") {
      return Promise.resolve(null);
    }

    return localForage.getItem(key);
  }

  static setItem(key, value) {
    return localForage.setItem(key, value);
  }
}
