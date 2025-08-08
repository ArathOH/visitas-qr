export type DynamicField = {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'number';
  required?: boolean;
};

export type Visitor = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dynamicAnswers?: Record<string, string | number>;
  qrId: string;
  createdAt: number;
};

export type Visit = {
  id: string;
  visitorId: string;
  ts: number;
};