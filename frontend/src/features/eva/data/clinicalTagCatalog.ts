/** Grouped clinical tags for @-mention — options match the product reference list only. */

export interface ClinicalTagCategory {
  id: string;
  title: string;
  tags: string[];
}

export const CLINICAL_TAG_CATEGORIES: ClinicalTagCategory[] = [
  {
    id: 'palpation',
    title: 'PALPATION FINDINGS',
    tags: [
      'Medial joint line tenderness',
      'Lateral joint line tenderness',
      'Patellar tendon tenderness',
      'No tenderness',
    ],
  },
  {
    id: 'rom',
    title: 'RANGE OF MOTION',
    tags: ['Right Knee Flexion', 'Left Knee Flexion', 'Knee Extension'],
  },
];
