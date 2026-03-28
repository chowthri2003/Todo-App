export type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
};

export type Theme = {
    name: string;
    colors: ThemeColors;
};

export const themes: Theme[] =[
     {
    name: 'Light',
    colors: {
      background: '#ffffff',
      text: '#0f172a',
      primary: '#f1f5f9',
      secondary: '#e2e8f0',
      accent: '#2563eb',
    },
  },
    {
    name: 'Dark',
    colors: {
      background: '#1a1a1a',
      text: '#ffffff',
      primary: '#1e293b',
      secondary: '#0f172a',
      accent: '#6366f1',
    },
  },
    {
   name: 'Pink',
    colors: {
      background: '#fdf2f8',
      text: '#831843',
      primary: '#fce7f3',
      secondary: '#fbcfe8',
      accent: '#db2777',
    },
  },
];