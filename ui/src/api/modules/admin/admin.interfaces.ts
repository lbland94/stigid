export interface FeatureFlag {
  name: string;
  value: boolean;
}

export interface Version {
  name: string;
  value: string;
}

export type FeatureFlagsResponse = FeatureFlag[];

export type VersionsResponse = Version[];
