import { ApiModule } from '@/api/modules/base/ApiModule';
import type {
  FeatureFlagsResponse,
  VersionsResponse,
} from './admin.interfaces';

export class AdminApi extends ApiModule {
  constructor(baseUrl: string) {
    super(baseUrl, '');
  }

  public async getFeatureFlags() {
    return this.get<FeatureFlagsResponse>('/featureFlag');
  }

  public async getVersions() {
    return this.get<VersionsResponse>('/versions');
  }
}
