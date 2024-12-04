import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Category } from '../../../../../models/Category';
import halClient, { HalResponse } from '../../../../../rest/halClient';
import { CATEGORY_RESOURCE_PATH } from '../../../../../rest/resources';

interface Props {
  value?: string[];
  onChange?: (value?: string[]) => void;
  maxSelection?: number;
  error?: boolean;
}

const PrimaryTechnologiesSelector = ({
  error,
  value,
  onChange,
  maxSelection = 3,
}: Props) => {
  const { data } = useQuery<HalResponse<Category>>({
    queryKey: [CATEGORY_RESOURCE_PATH],
    queryFn: () =>
      halClient.fetchResource<Category>(CATEGORY_RESOURCE_PATH, {
        params: { page: 0, size: 9999 },
      }),
  });

  const handleChange = (_: any, newValue: any) => {
    if (newValue && newValue?.length > maxSelection) {
      return;
    }
    onChange && onChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        fullWidth
        options={data?._embedded?.categories?.map((item) => item.name) || []}
        value={value}
        onChange={handleChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={index}
              variant="outlined"
              label={option}
              onDelete={getTagProps({ index }).onDelete}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={`Select maximum ${maxSelection} technologies`}
            placeholder="Add more..."
            error={error}
          />
        )}
      />
    </Box>
  );
};

export default PrimaryTechnologiesSelector;
