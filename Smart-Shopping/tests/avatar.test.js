import { describe, it, expect } from 'vitest';
import {
  detectGenderFromName,
  getUserAvatar,
  getEffectiveUserAvatar,
  MALE_AVATARS,
  FEMALE_AVATARS,
  PRESET_AVATARS,
} from '../src/utils/avatar';

describe('Avatar & User Profile Photo Engine', () => {
  describe('detectGenderFromName', () => {
    it('accurately identifies Avikkulavi1 and compound usernames as male', () => {
      expect(detectGenderFromName('Avikkulavi1')).toBe('male');
      expect(detectGenderFromName('avikkulavi1')).toBe('male');
      expect(detectGenderFromName('AvikKulavi')).toBe('male');
      expect(detectGenderFromName('avikkulavi1@gmail.com')).toBe('male');
      expect(detectGenderFromName('Avik Kulavi')).toBe('male');
      expect(detectGenderFromName('Kulavi')).toBe('male');
      expect(detectGenderFromName('avik')).toBe('male');
    });

    it('accurately identifies Ahana as female', () => {
      expect(detectGenderFromName('Ahana')).toBe('female');
      expect(detectGenderFromName('ahana@gmail.com')).toBe('female');
    });

    it('detects common male names accurately', () => {
      const maleNames = [
        'Rahul Sharma',
        'Avik Kulavi',
        'Rohit Sen',
        'Alex Morgan',
        'David Miller',
        'Tanmoy Mukherjee',
        'Sayan Das',
        'Arjun Verma',
        'Amitabh Bachchan',
        'Subrata Ghosh',
        'Mr. John Doe',
        'Sri Ramakrishna',
        'Koushik',
        'Ravi',
        'Hari',
      ];

      maleNames.forEach((name) => {
        expect(detectGenderFromName(name)).toBe('male');
      });
    });

    it('detects common female names accurately', () => {
      const femaleNames = [
        'Priya Sharma',
        'Sarah Connor',
        'Sneha Roy',
        'Ananya Banerjee',
        'Pooja Hegde',
        'Deepa Karmakar',
        'Sunita Williams',
        'Emily Watson',
        'Mrs. Jane Smith',
        'Ms. Laura Croft',
        'Sharmila Tagore',
        'Moumita Paul',
        'Tanushree Dutta',
        'priyadas1',
        'Ahana',
      ];

      femaleNames.forEach((name) => {
        expect(detectGenderFromName(name)).toBe('female');
      });
    });

    it('detects female names using morphological suffixes', () => {
      expect(detectGenderFromName('Madhumita')).toBe('female');
      expect(detectGenderFromName('Anindita')).toBe('female');
      expect(detectGenderFromName('Subhashree')).toBe('female');
      expect(detectGenderFromName('Kalawati')).toBe('female');
      expect(detectGenderFromName('Shanti Devi')).toBe('female');
    });

    it('handles edge cases gracefully with male default fallback', () => {
      expect(detectGenderFromName('')).toBe('male');
      expect(detectGenderFromName(null)).toBe('male');
      expect(detectGenderFromName(undefined)).toBe('male');
      expect(detectGenderFromName('12345')).toBe('male');
    });
  });

  describe('getUserAvatar', () => {
    it('returns an avatar from MALE_AVATARS for Avikkulavi1', () => {
      const avatar = getUserAvatar('Avikkulavi1', 'avikkulavi1@gmail.com');
      expect(MALE_AVATARS).toContain(avatar);
      expect(FEMALE_AVATARS).not.toContain(avatar);
    });

    it('returns an avatar from MALE_AVATARS for male names', () => {
      const avatar1 = getUserAvatar('Avik Kulavi', 'avik@example.com');
      const avatar2 = getUserAvatar('Alex Morgan', 'alex@shopsphere.com');
      const avatar3 = getUserAvatar('Rahul Sen', 'rahul@test.com');

      expect(MALE_AVATARS).toContain(avatar1);
      expect(MALE_AVATARS).toContain(avatar2);
      expect(MALE_AVATARS).toContain(avatar3);
      expect(FEMALE_AVATARS).not.toContain(avatar1);
    });

    it('returns an avatar from FEMALE_AVATARS for female names', () => {
      const avatar1 = getUserAvatar('Sarah Connor', 'sarah@example.com');
      const avatar2 = getUserAvatar('Priya Sharma', 'priya@test.com');
      const avatar3 = getUserAvatar('Sneha Mukherjee', 'sneha@example.com');

      expect(FEMALE_AVATARS).toContain(avatar1);
      expect(FEMALE_AVATARS).toContain(avatar2);
      expect(FEMALE_AVATARS).toContain(avatar3);
      expect(MALE_AVATARS).not.toContain(avatar1);
    });

    it('is deterministic for the same name and email seed', () => {
      const run1 = getUserAvatar('Ananya Das', 'ananya@example.com');
      const run2 = getUserAvatar('Ananya Das', 'ananya@example.com');
      expect(run1).toBe(run2);
    });

    it('respects explicit gender override if provided', () => {
      const avatarForcedFemale = getUserAvatar('Rahul', 'seed', 'female');
      const avatarForcedMale = getUserAvatar('Priya', 'seed', 'male');

      expect(FEMALE_AVATARS).toContain(avatarForcedFemale);
      expect(MALE_AVATARS).toContain(avatarForcedMale);
    });
  });

  describe('getEffectiveUserAvatar user photo customization', () => {
    it('unconditionally returns user custom uploaded photo (data URL)', () => {
      const customDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const user = {
        name: 'Avik Kulavi',
        email: 'avik@example.com',
        avatar: customDataUrl,
      };

      expect(getEffectiveUserAvatar(user)).toBe(customDataUrl);
    });

    it('unconditionally returns custom external URL provided by user', () => {
      const externalUrl = 'https://mycustomcdn.com/my-photo.jpg';
      const user = {
        name: 'Ahana',
        email: 'ahana@gmail.com',
        avatar: externalUrl,
      };

      expect(getEffectiveUserAvatar(user)).toBe(externalUrl);
    });

    it('falls back to default preset avatar when no avatar exists', () => {
      const user = {
        name: 'Guest User',
        email: 'guest@example.com',
      };

      const avatar = getEffectiveUserAvatar(user);
      expect(PRESET_AVATARS).toContain(avatar);
    });
  });
});
