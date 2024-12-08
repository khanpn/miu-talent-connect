import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { CategoryFilter } from '../../../models/CategoryFilter';
import halClient, { HalResponse } from '../../../rest/halClient';
import { CATEGORY_RESOURCE_PATH } from '../../../rest/resources';
import useCandidateProfileQuery from '../../../stores/SearchCandidateQueryStore';
import { CategoryType } from '../../../models/CategoryType';
import { getEnumKey } from '../../../utils/Enums';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../constants/Spacing';

const CATEGORY_WITH_CANDIDATE_COUNT_RESOURCE_PATH = `${CATEGORY_RESOURCE_PATH}/search/findAllWithCandidateCount`;

interface CategoryCheckboxOption {
  name: string;
  checked: boolean;
  type: CategoryType;
  candidateCount: number;
}

const CandidateFilters = () => {
  const { data } = useQuery<HalResponse<CategoryFilter>>({
    queryKey: [CATEGORY_WITH_CANDIDATE_COUNT_RESOURCE_PATH],
    queryFn: () =>
      halClient.fetchResource<CategoryFilter>(
        CATEGORY_WITH_CANDIDATE_COUNT_RESOURCE_PATH
      ),
  });
  const { setCategories, setPageNumber } = useCandidateProfileQuery();
  const [options, setOptions] = useState<CategoryCheckboxOption[]>([]);

  const CategoryList = ({ items }: { items: CategoryCheckboxOption[] }) => {
    return (
      <FormGroup>
        {items.map((option) => (
          <FormControlLabel
            key={option.name}
            control={
              <Checkbox
                size="medium"
                value={option.name}
                checked={option.checked}
                onChange={handleChange}
                name={option.name}
                color="primary"
              />
            }
            label={
              <Typography color="primary">
                {option.name} ({option.candidateCount})
              </Typography>
            }
          />
        ))}
      </FormGroup>
    );
  };

  useEffect(() => {
    setOptions(
      data?._embedded?.categories.map((category) => ({
        ...category,
        checked: false,
      })) || []
    );
  }, [data]);

  useEffect(() => {
    setCategories(
      options.filter((option) => option.checked).map((option) => option.name)
    );
    setPageNumber(0);
  }, [options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOptions([
      ...options.map((option) =>
        option.name === value ? { ...option, checked: !option.checked } : option
      ),
    ]);
  };

  return (
    <FormControl
      sx={{ m: CONTENT_PADDING }}
      component="fieldset"
      variant="standard"
    >
      <Typography variant="h5" gutterBottom color="primary">
        Candidate Filters
      </Typography>
      <Box pt={FIELDS_SPACING} />
      <Typography variant="h6" gutterBottom>
        Technologies
      </Typography>
      <CategoryList
        items={options.filter(
          (o) => getEnumKey(CategoryType, CategoryType.TECHNOLOGY) === o.type
        )}
      />
      <Box pt={FIELDS_SPACING} />
      <Typography variant="h6" gutterBottom>
        Roles
      </Typography>
      <CategoryList
        items={options.filter(
          (o) => getEnumKey(CategoryType, CategoryType.ROLE) === o.type
        )}
      />
      <Box pt={FIELDS_SPACING} />
      <Typography variant="h6" gutterBottom>
        Languages
      </Typography>
      <CategoryList
        items={options.filter(
          (o) => getEnumKey(CategoryType, CategoryType.LANGUAGE) === o.type
        )}
      />
    </FormControl>
  );
};

export default CandidateFilters;
