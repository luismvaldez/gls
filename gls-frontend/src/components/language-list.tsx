import React from 'react';
import { Badge } from '@/components/ui/badge';

type LanguagesListProps = {
  languages: Record<string, number>;
};

const LanguagesList: React.FC<LanguagesListProps> = ({ languages }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Languages</h2>
      <div className="flex flex-wrap gap-2">
        {Object.keys(languages).map((language) => (
          <Badge key={language} variant="outline">
            {language}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export default LanguagesList;