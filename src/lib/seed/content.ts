import { Timestamp } from 'firebase/firestore';
import { Content, ContentData, ContentMetadata } from '@/types';

// Generate timestamps for consistent seed data
const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

// Content metadata seed data
export const contentMetadataSeed: ContentMetadata[] = [
  {
    duration: 120, // 2 minutes
    dimensions: { width: 1920, height: 1080 },
    description: 'A beautiful sunset over the mountains',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    fileHash: 'abc123def456',
  },
  {
    duration: 180, // 3 minutes
    dimensions: { width: 1280, height: 720 },
    description: 'Family gathering at the beach',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    fileHash: 'def456ghi789',
  },
  {
    duration: 90, // 1.5 minutes
    dimensions: { width: 1920, height: 1080 },
    description: 'Birthday celebration with friends',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop',
    fileHash: 'ghi789jkl012',
  },
];

// Text content seed data
export const textContentSeed: ContentData[] = [
  {
    type: 'text',
    data: {
      text: 'Today was an amazing day! I finally graduated from college and I couldn\'t be happier. The ceremony was beautiful, and seeing all my friends and family there made it even more special. I can\'t wait to see what the future holds!',
      format: 'plain',
    },
  },
  {
    type: 'text',
    data: {
      text: '# My First Day at Work\n\nToday I started my new job as a software developer. The team is amazing and everyone was so welcoming. I\'m excited to learn and grow in this role.\n\n## Goals for this year:\n- Learn React and Node.js\n- Contribute to open source projects\n- Build meaningful relationships with colleagues',
      format: 'markdown',
    },
  },
  {
    type: 'text',
    data: {
      text: '<h2>Wedding Day Memories</h2><p>The most beautiful day of our lives. Every moment was perfect, from the ceremony to the reception. I\'ll never forget the look on your face when you saw me walking down the aisle.</p><p>Here\'s to forever together! 💕</p>',
      format: 'html',
    },
  },
  {
    type: 'text',
    data: {
      text: 'Dear Future Me,\n\nI hope you\'re doing well and that all your dreams have come true. Remember to always stay true to yourself and never give up on what you believe in.\n\nWith love,\nPast You',
      format: 'plain',
    },
  },
];

// Media content seed data
export const mediaContentSeed: ContentData[] = [
  {
    type: 'image',
    data: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      fileName: 'sunset-mountains.jpg',
      fileSize: 2048576, // 2MB
      mimeType: 'image/jpeg',
      metadata: contentMetadataSeed[0],
    },
  },
  {
    type: 'image',
    data: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      fileName: 'beach-family.jpg',
      fileSize: 1536000, // 1.5MB
      mimeType: 'image/jpeg',
      metadata: contentMetadataSeed[1],
    },
  },
  {
    type: 'video',
    data: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      fileName: 'birthday-celebration.mp4',
      fileSize: 1048576, // 1MB
      mimeType: 'video/mp4',
      metadata: contentMetadataSeed[2],
    },
  },
  {
    type: 'audio',
    data: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      fileName: 'wedding-bells.wav',
      fileSize: 512000, // 512KB
      mimeType: 'audio/wav',
      metadata: {
        duration: 30,
        description: 'Wedding bells ringing',
        fileHash: 'wedding-bells-hash',
      },
    },
  },
];

// Document content seed data
export const documentContentSeed: ContentData[] = [
  {
    type: 'document',
    data: {
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'graduation-certificate.pdf',
      fileSize: 1024000, // 1MB
      mimeType: 'application/pdf',
      pageCount: 2,
      metadata: {
        description: 'Official graduation certificate',
        fileHash: 'cert-hash-123',
      },
    },
  },
  {
    type: 'document',
    data: {
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'wedding-invitation.pdf',
      fileSize: 512000, // 512KB
      mimeType: 'application/pdf',
      pageCount: 1,
      metadata: {
        description: 'Wedding invitation design',
        fileHash: 'invitation-hash-456',
      },
    },
  },
];

// Content seed data
export const contentSeed: Omit<Content, 'id'>[] = [
  // Text content
  {
    capsuleId: 'capsule1', // Will be replaced with actual capsule ID
    type: 'text',
    order: 0,
    data: textContentSeed[0],
    isProcessed: true,
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneWeekAgo),
  },
  {
    capsuleId: 'capsule1',
    type: 'text',
    order: 1,
    data: textContentSeed[1],
    isProcessed: true,
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  // Image content
  {
    capsuleId: 'capsule2',
    type: 'image',
    order: 0,
    data: mediaContentSeed[0],
    isProcessed: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  {
    capsuleId: 'capsule2',
    type: 'image',
    order: 1,
    data: mediaContentSeed[1],
    isProcessed: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  // Video content
  {
    capsuleId: 'capsule3',
    type: 'video',
    order: 0,
    data: mediaContentSeed[2],
    isProcessed: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop',
    createdAt: Timestamp.fromDate(oneDayAgo),
    updatedAt: Timestamp.fromDate(now),
  },
  // Audio content
  {
    capsuleId: 'capsule4',
    type: 'audio',
    order: 0,
    data: mediaContentSeed[3],
    isProcessed: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    createdAt: Timestamp.fromDate(oneDayAgo),
    updatedAt: Timestamp.fromDate(now),
  },
  // Document content
  {
    capsuleId: 'capsule1',
    type: 'document',
    order: 2,
    data: documentContentSeed[0],
    isProcessed: true,
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneWeekAgo),
  },
  {
    capsuleId: 'capsule2',
    type: 'document',
    order: 2,
    data: documentContentSeed[1],
    isProcessed: true,
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
];

// Generate random content data for bulk testing
export const generateRandomContent = (capsuleId: string, order: number): Omit<Content, 'id'> => {
  const contentTypes = ['text', 'image', 'video', 'audio', 'document'] as const;
  const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
  
  const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  
  let data: ContentData;
  
  switch (type) {
    case 'text':
      const textSamples = [
        'This is a random text entry for testing purposes.',
        'Another day, another memory to capture.',
        'Life is beautiful when you take the time to notice.',
        'Every moment is a chance to create something amazing.',
        'The best stories are the ones we live ourselves.',
      ];
      data = {
        type: 'text',
        data: {
          text: textSamples[Math.floor(Math.random() * textSamples.length)],
          format: Math.random() > 0.5 ? 'plain' : 'markdown',
        },
      };
      break;
      
    case 'image':
      data = {
        type: 'image',
        data: {
          url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop`,
          fileName: `image-${order}.jpg`,
          fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
          mimeType: 'image/jpeg',
          metadata: {
            dimensions: { width: 1920, height: 1080 },
            description: 'Random image for testing',
            fileHash: `hash-${Math.random().toString(36).substr(2, 9)}`,
          },
        },
      };
      break;
      
    case 'video':
      data = {
        type: 'video',
        data: {
          url: `https://sample-videos.com/zip/10/mp4/SampleVideo_${Math.floor(Math.random() * 5) + 1}.mp4`,
          fileName: `video-${order}.mp4`,
          fileSize: Math.floor(Math.random() * 50000000) + 1000000, // 1MB to 50MB
          mimeType: 'video/mp4',
          metadata: {
            duration: Math.floor(Math.random() * 300) + 30, // 30 seconds to 5 minutes
            dimensions: { width: 1920, height: 1080 },
            description: 'Random video for testing',
            fileHash: `video-hash-${Math.random().toString(36).substr(2, 9)}`,
          },
        },
      };
      break;
      
    case 'audio':
      data = {
        type: 'audio',
        data: {
          url: `https://www.soundjay.com/misc/sounds/sound-${Math.floor(Math.random() * 10) + 1}.wav`,
          fileName: `audio-${order}.wav`,
          fileSize: Math.floor(Math.random() * 10000000) + 100000, // 100KB to 10MB
          mimeType: 'audio/wav',
          metadata: {
            duration: Math.floor(Math.random() * 180) + 30, // 30 seconds to 3 minutes
            description: 'Random audio for testing',
            fileHash: `audio-hash-${Math.random().toString(36).substr(2, 9)}`,
          },
        },
      };
      break;
      
    case 'document':
      data = {
        type: 'document',
        data: {
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileName: `document-${order}.pdf`,
          fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
          mimeType: 'application/pdf',
          pageCount: Math.floor(Math.random() * 10) + 1,
          metadata: {
            description: 'Random document for testing',
            fileHash: `doc-hash-${Math.random().toString(36).substr(2, 9)}`,
          },
        },
      };
      break;
  }
  
  return {
    capsuleId,
    type,
    order,
    data,
    isProcessed: Math.random() > 0.2,
    thumbnailUrl: type === 'video' || type === 'audio' ? 
      `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000)}?w=300&h=200&fit=crop` : 
      undefined,
    createdAt: Timestamp.fromDate(createdAt),
    updatedAt: Timestamp.fromDate(new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)),
  };
};

// Generate multiple random content items for a capsule
export const generateRandomContentItems = (capsuleId: string, count: number): Omit<Content, 'id'>[] => {
  return Array.from({ length: count }, (_, index) => generateRandomContent(capsuleId, index));
};
