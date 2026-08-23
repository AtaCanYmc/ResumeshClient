import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-hidden="true" />
      <p className="font-medium text-gray-500 dark:text-gray-400">Sayfa yükleniyor...</p>
    </div>
  );
};

export default PageLoader;
