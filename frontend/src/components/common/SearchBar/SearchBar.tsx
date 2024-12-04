import SearchIcon from '@mui/icons-material/Search';
import { Box, Chip, styled, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import useCandidateProfileQuery from '../../../stores/SearchCandidateQueryStore';
import { CONTENT_PADDING } from '../../../constants/Spacing';

const StyledBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
}));

const SearchBar = () => {
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const setSearchText = useCandidateProfileQuery(
    (state) => state.setSearchTerms
  );

  useEffect(() => {
    setSearchText(searchTerms?.join(','));
  }, [searchTerms]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      if (!searchTerms.includes(inputValue.trim())) {
        setSearchTerms([...searchTerms, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleDelete = (chipToDelete: string) => {
    setSearchTerms(searchTerms.filter((chip) => chip !== chipToDelete));
  };

  return (
    <StyledBox>
      <Box sx={{ p: CONTENT_PADDING }}>
        <Typography variant="h6" gutterBottom color="primary">
          Search
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter key words"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Press Enter to add"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {searchTerms.map((term, index) => (
            <Chip
              key={index}
              label={term}
              onDelete={() => handleDelete(term)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </StyledBox>
  );
};

export default SearchBar;
