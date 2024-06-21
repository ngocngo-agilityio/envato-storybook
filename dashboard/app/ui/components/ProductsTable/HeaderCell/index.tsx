// Libs
import { memo, useCallback } from 'react';
import { Th } from '@chakra-ui/react';

// Components
import { HeadCell } from '@/ui/components';

// Types
import { TProductSortField } from '@/lib/interfaces';

interface Props {
  title: string;
  sortedField: TProductSortField;
  onSort: (sortField: TProductSortField) => void;
}

const HeaderCell = ({ title, sortedField, onSort }: Props) => {
  const handleSortField = useCallback(() => {
    onSort(sortedField);
  }, [onSort, sortedField]);

  return title ? (
    <HeadCell key={title} title={title} onClick={handleSortField} />
  ) : (
    <Th w={50} maxW={50} />
  );
};

const HeaderCellMemorized = memo(HeaderCell);

export default HeaderCellMemorized;
