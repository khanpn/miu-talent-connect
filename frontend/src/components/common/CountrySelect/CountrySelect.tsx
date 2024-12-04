import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
} from '@mui/material';
import { countryTuples, CountrySlug, CountryName } from 'country-region-data';

interface Props {
  onChange?: (value?: string) => void;
  value?: string;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
}

const CountrySelect = ({ value, onChange, renderInput }: Props) => {
  const defaultOptionIndex = countryTuples.findIndex((ct) => ct[1] === value);
  let defaultOption;
  if (defaultOptionIndex != undefined) {
    defaultOption = countryTuples[defaultOptionIndex];
  }
  return (
    <Autocomplete
      id="country-select"
      value={defaultOption}
      options={countryTuples}
      onChange={(_, newValue: [CountryName, CountrySlug] | null) => {
        onChange && onChange(newValue?.[1]);
      }}
      autoHighlight
      getOptionLabel={(option) => option[0]}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option[1].toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option[1].toLowerCase()}.png`}
              alt=""
            />
            {option[0]} ({option[1]})
          </Box>
        );
      }}
      renderInput={
        renderInput
          ? renderInput
          : (params) => (
              <TextField
                {...params}
                slotProps={{
                  htmlInput: {
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  },
                }}
              />
            )
      }
    />
  );
};

export default CountrySelect;
