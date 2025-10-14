/**
 * 验证工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  isValidGist,
  isValidNonEmptyGist,
  isValidGistWithNonEmptyStrings,
  isValidSlideNote,
  isValidSlideNoteReply,
  isValidSlideNotes
} from '../../src/utils/validation-helpers.js';
import type { V1SlideNote, V1SlideNoteReply } from '../../src/types/v1-compat-types.js';

describe('Validation Helpers', () => {
  describe('isValidGist', () => {
    it('should return true for valid string array', () => {
      const gist = ['Key point 1', 'Key point 2', 'Key point 3'];
      expect(isValidGist(gist)).toBe(true);
    });

    it('should return true for empty array', () => {
      const gist: string[] = [];
      expect(isValidGist(gist)).toBe(true);
    });

    it('should return false for non-array values', () => {
      expect(isValidGist('not an array')).toBe(false);
      expect(isValidGist(123)).toBe(false);
      expect(isValidGist(null)).toBe(false);
      expect(isValidGist(undefined)).toBe(false);
      expect(isValidGist({})).toBe(false);
    });

    it('should return false for array with non-string elements', () => {
      expect(isValidGist(['string', 123])).toBe(false);
      expect(isValidGist(['string', null])).toBe(false);
      expect(isValidGist(['string', undefined])).toBe(false);
      expect(isValidGist([1, 2, 3])).toBe(false);
    });

    it('should handle array with empty strings', () => {
      const gist = ['point 1', '', 'point 3'];
      expect(isValidGist(gist)).toBe(true); // Empty strings are still strings
    });
  });

  describe('isValidNonEmptyGist', () => {
    it('should return true for non-empty string array', () => {
      const gist = ['Key point 1'];
      expect(isValidNonEmptyGist(gist)).toBe(true);
    });

    it('should return false for empty array', () => {
      const gist: string[] = [];
      expect(isValidNonEmptyGist(gist)).toBe(false);
    });

    it('should return false for invalid values', () => {
      expect(isValidNonEmptyGist('not an array')).toBe(false);
      expect(isValidNonEmptyGist(null)).toBe(false);
      expect(isValidNonEmptyGist(undefined)).toBe(false);
    });
  });

  describe('isValidGistWithNonEmptyStrings', () => {
    it('should return true for array with non-empty strings', () => {
      const gist = ['Key point 1', 'Key point 2'];
      expect(isValidGistWithNonEmptyStrings(gist)).toBe(true);
    });

    it('should return false for array with empty strings', () => {
      const gist = ['Key point 1', '', 'Key point 3'];
      expect(isValidGistWithNonEmptyStrings(gist)).toBe(false);
    });

    it('should return false for array with whitespace-only strings', () => {
      const gist = ['Key point 1', '   ', 'Key point 3'];
      expect(isValidGistWithNonEmptyStrings(gist)).toBe(false);
    });

    it('should return true for empty array', () => {
      const gist: string[] = [];
      expect(isValidGistWithNonEmptyStrings(gist)).toBe(true);
    });

    it('should handle strings with leading/trailing whitespace', () => {
      const gist = ['  Key point 1  ', 'Key point 2'];
      expect(isValidGistWithNonEmptyStrings(gist)).toBe(true);
    });
  });

  describe('isValidSlideNoteReply', () => {
    it('should return true for valid reply object', () => {
      const reply: V1SlideNoteReply = {
        id: 'reply-1',
        content: 'Reply content',
        time: Date.now(),
        user: 'user-123'
      };
      expect(isValidSlideNoteReply(reply)).toBe(true);
    });

    it('should return false for missing required fields', () => {
      expect(isValidSlideNoteReply({
        id: 'reply-1',
        content: 'Content',
        time: Date.now()
        // missing user
      })).toBe(false);

      expect(isValidSlideNoteReply({
        id: 'reply-1',
        content: 'Content',
        user: 'user-123'
        // missing time
      })).toBe(false);
    });

    it('should return false for wrong field types', () => {
      expect(isValidSlideNoteReply({
        id: 123, // should be string
        content: 'Content',
        time: Date.now(),
        user: 'user-123'
      })).toBe(false);

      expect(isValidSlideNoteReply({
        id: 'reply-1',
        content: 'Content',
        time: '1234567890', // should be number
        user: 'user-123'
      })).toBe(false);
    });

    it('should return false for non-object values', () => {
      expect(isValidSlideNoteReply(null)).toBe(false);
      expect(isValidSlideNoteReply(undefined)).toBe(false);
      expect(isValidSlideNoteReply('string')).toBe(false);
      expect(isValidSlideNoteReply(123)).toBe(false);
    });
  });

  describe('isValidSlideNote', () => {
    it('should return true for valid note without optional fields', () => {
      const note: V1SlideNote = {
        id: 'note-1',
        content: 'Note content',
        time: Date.now(),
        user: 'user-123'
      };
      expect(isValidSlideNote(note)).toBe(true);
    });

    it('should return true for valid note with all fields', () => {
      const note: V1SlideNote = {
        id: 'note-1',
        content: 'Note content',
        time: Date.now(),
        user: 'user-123',
        elId: 'element-1',
        replies: [
          {
            id: 'reply-1',
            content: 'Reply content',
            time: Date.now(),
            user: 'user-456'
          }
        ]
      };
      expect(isValidSlideNote(note)).toBe(true);
    });

    it('should return false for missing required fields', () => {
      expect(isValidSlideNote({
        id: 'note-1',
        content: 'Content',
        time: Date.now()
        // missing user
      })).toBe(false);
    });

    it('should return false for invalid elId type', () => {
      expect(isValidSlideNote({
        id: 'note-1',
        content: 'Content',
        time: Date.now(),
        user: 'user-123',
        elId: 123 // should be string
      })).toBe(false);
    });

    it('should return false for invalid replies array', () => {
      expect(isValidSlideNote({
        id: 'note-1',
        content: 'Content',
        time: Date.now(),
        user: 'user-123',
        replies: 'not an array'
      })).toBe(false);

      expect(isValidSlideNote({
        id: 'note-1',
        content: 'Content',
        time: Date.now(),
        user: 'user-123',
        replies: [
          {
            id: 'reply-1',
            content: 'Reply',
            time: Date.now()
            // missing user
          }
        ]
      })).toBe(false);
    });

    it('should return true for note with empty replies array', () => {
      const note: V1SlideNote = {
        id: 'note-1',
        content: 'Content',
        time: Date.now(),
        user: 'user-123',
        replies: []
      };
      expect(isValidSlideNote(note)).toBe(true);
    });
  });

  describe('isValidSlideNotes', () => {
    it('should return true for valid notes array', () => {
      const notes: V1SlideNote[] = [
        {
          id: 'note-1',
          content: 'Note 1',
          time: Date.now(),
          user: 'user-123'
        },
        {
          id: 'note-2',
          content: 'Note 2',
          time: Date.now(),
          user: 'user-456',
          elId: 'element-1'
        }
      ];
      expect(isValidSlideNotes(notes)).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isValidSlideNotes([])).toBe(true);
    });

    it('should return false for array with invalid notes', () => {
      const notes = [
        {
          id: 'note-1',
          content: 'Note 1',
          time: Date.now(),
          user: 'user-123'
        },
        {
          id: 'note-2',
          content: 'Note 2',
          time: Date.now()
          // missing user
        }
      ];
      expect(isValidSlideNotes(notes)).toBe(false);
    });

    it('should return false for non-array values', () => {
      expect(isValidSlideNotes('not an array')).toBe(false);
      expect(isValidSlideNotes(null)).toBe(false);
      expect(isValidSlideNotes(undefined)).toBe(false);
      expect(isValidSlideNotes({})).toBe(false);
    });
  });

  describe('Type guard functionality', () => {
    it('should enable type narrowing for gist', () => {
      const data: unknown = ['point 1', 'point 2'];

      if (isValidGist(data)) {
        // TypeScript should know data is string[]
        const length: number = data.length;
        const first: string = data[0];
        expect(length).toBe(2);
        expect(first).toBe('point 1');
      }
    });

    it('should enable type narrowing for non-empty gist', () => {
      const data: unknown = ['point 1'];

      if (isValidNonEmptyGist(data)) {
        // TypeScript should know data has at least one element
        const first: string = data[0];
        expect(first).toBe('point 1');
      }
    });

    it('should enable type narrowing for slide note', () => {
      const data: unknown = {
        id: 'note-1',
        content: 'Content',
        time: Date.now(),
        user: 'user-123'
      };

      if (isValidSlideNote(data)) {
        // TypeScript should know data is V1SlideNote
        const id: string = data.id;
        const content: string = data.content;
        expect(id).toBe('note-1');
        expect(content).toBe('Content');
      }
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should validate gist from API response', () => {
      // Simulate API response with unknown type
      const apiResponse: unknown = {
        gist: ['Feature 1', 'Feature 2', 'Feature 3']
      };

      const response = apiResponse as Record<string, unknown>;

      if (isValidGist(response.gist)) {
        expect(response.gist).toHaveLength(3);
        expect(response.gist[0]).toBe('Feature 1');
      }
    });

    it('should validate slide notes from external data', () => {
      const externalData: unknown = [
        {
          id: 'note-1',
          content: 'Review this slide',
          time: 1697000000000,
          user: 'reviewer@example.com',
          replies: [
            {
              id: 'reply-1',
              content: 'Looks good',
              time: 1697001000000,
              user: 'author@example.com'
            }
          ]
        }
      ];

      if (isValidSlideNotes(externalData)) {
        expect(externalData).toHaveLength(1);
        expect(externalData[0].content).toBe('Review this slide');
        expect(externalData[0].replies).toHaveLength(1);
      }
    });

    it('should handle malformed gist data gracefully', () => {
      const malformedData = [
        ['correct', 'gist'],           // valid
        ['has', 123, 'number'],        // invalid - has number
        'not an array',                 // invalid - not array
        null,                           // invalid - null
        [],                             // valid - empty array
      ];

      const validGists = malformedData.filter(isValidGist);
      expect(validGists).toHaveLength(2);
    });
  });
});
