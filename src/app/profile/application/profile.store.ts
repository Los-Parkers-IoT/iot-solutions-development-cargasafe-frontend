import { Injectable } from '@angular/core';
import { createAsyncState } from '../../shared/helpers/async-state';
import { Profile } from '../domain/model/profile.entity';
import { timeout } from '../../shared/helpers/promises';

@Injectable({ providedIn: 'root' })
export class ProfileStore {
  readonly profileState = createAsyncState<Profile | null>(null);

  async loadProfileByUserId(userId: number) {
    this.profileState.setLoading(true);

    try {
      await timeout(1000);
      const mockProfile = new Profile({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        documentType: 'DNI',
        document: '72012428',
        userId: userId,
        phoneNumber: null,
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.profileState.setData(mockProfile);
    } finally {
      this.profileState.setLoading(false);
    }
  }

  updateProfile(profile: Profile) {
    this.profileState.setData(profile);
  }
}
