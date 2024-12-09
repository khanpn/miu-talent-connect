import AnalyticsIcon from '@mui/icons-material/AnalyticsOutlined';
import {
  Box,
  ButtonGroup,
  Grid2 as Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import useSearchCandidates from '../../../hooks/useSearchCandidates';
import SearchBar from '../../common/SearchBar/SearchBar';
import CandidateListItem from './CandidateListItem/CandidateListItem';
import useSearchCandidateQuery from '../../../stores/SearchCandidateQueryStore';
import { CONTENT_PADDING } from '../../../constants/Spacing';
import PageLoading from '../../common/PageLoading/PageLoading';

const CandidateList = () => {
  const { data, isLoading } = useSearchCandidates();
  const [showSkillsMetrix, setShowSkillsMetrix] = useState(true);
  const setPageNumber = useSearchCandidateQuery((state) => state.setPageNumber);

  const onPageChange = (_: any, pageNumber: number) => {
    setPageNumber(pageNumber - 1);
  };

  return (
    <>
      <Stack direction="column">
        <SearchBar />
        <Box my={1} />
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography>Show Skills Metrix</Typography>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="View Mode button group"
          >
            <IconButton
              aria-label="show-skills-metrix"
              onClick={() => setShowSkillsMetrix((value) => !value)}
            >
              <AnalyticsIcon
                fontSize="large"
                color={showSkillsMetrix ? 'primary' : 'disabled'}
              />
            </IconButton>
          </ButtonGroup>
        </Box>
        <Box
          mb={2}
          display="flex"
          justifyContent="flex-end"
          alignItems="baseline"
        >
          {data?.page?.totalElements} results
          <Pagination
            count={data?.page?.totalPages}
            shape="rounded"
            page={(data?.page?.number || 0) + 1}
            onChange={onPageChange}
          />
        </Box>
        <Grid container spacing={3}>
          {data?._embedded?.candidateSearches?.map((e, index) => (
            <Grid key={index} size={{ sm: 12 }}>
              <CandidateListItem
                showSkillsMetrix={showSkillsMetrix}
                key={index}
                profile={e}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          my={CONTENT_PADDING}
          display="flex"
          justifyContent="flex-end"
          alignItems="baseline"
        >
          {data?.page?.totalElements} results
          <Pagination
            count={data?.page?.totalPages}
            shape="rounded"
            page={(data?.page?.number || 0) + 1}
            onChange={onPageChange}
          />
        </Box>
      </Stack>
      <PageLoading open={isLoading} />
    </>
  );
};

export default CandidateList;
