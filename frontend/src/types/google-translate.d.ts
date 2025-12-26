declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (options: any, element: HTMLElement): any;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}

export {}; 