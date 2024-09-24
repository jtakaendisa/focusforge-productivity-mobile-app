import { getYear } from 'date-fns';
import { useState } from 'react';
import { BarGraphFilter } from '../entities';

const useBarGraph = () => {
  const currentYear = getYear(new Date());

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [barGraphFilter, setBarGraphFilter] = useState<BarGraphFilter>('month');

  const handleYearChange = (direction: 'left' | 'right') =>
    setSelectedYear((prev) => (direction === 'left' ? prev - 1 : prev + 1));

  const handleFilterSelect = (filter: BarGraphFilter) => setBarGraphFilter(filter);

  return {
    currentYear,
    selectedYear,
    barGraphFilter,
    handleFilterSelect,
    handleYearChange,
  };
};

export default useBarGraph;
