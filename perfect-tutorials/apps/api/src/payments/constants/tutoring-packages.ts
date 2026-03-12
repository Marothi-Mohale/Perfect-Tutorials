export type TutoringPackage = {
  id: string;
  name: string;
  description: string;
  amountInCents: number;
  currency: 'zar';
};

export const tutoringPackages: Record<string, TutoringPackage> = {
  'standard-4-sessions': {
    id: 'standard-4-sessions',
    name: 'Standard Package',
    description: '4 monthly tutoring sessions with weekly academic support.',
    amountInCents: 149900,
    currency: 'zar',
  },
};
