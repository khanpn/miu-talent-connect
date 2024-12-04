import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { CONTENT_PADDING, FIELDS_SPACING } from '../../../constants/Spacing';
import { Category } from '../../../models/Category';
import React, { useEffect, useState } from 'react';
import PageLoading from '../../common/PageLoading/PageLoading';
import restClient, { extractErrorMessage } from '../../../rest/restClient';
import { CATEGORY_RESOURCE_PATH } from '../../../rest/resources';
import halClient from '../../../rest/halClient';
import ConfirmModal from '../../common/ConfirmModal/ConfirmModal';
import { getEnumKey } from '../../../utils/Enums';
import { CategoryType } from '../../../models/CategoryType';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] =
    useState<keyof typeof CategoryType>('TECHNOLOGY');
  const [errorTextField, setErrorTextField] = useState('');
  const [errorServer, setErrorServer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<Category>();

  useEffect(() => {
    halClient
      .fetchResource<Category>(CATEGORY_RESOURCE_PATH, {
        params: { page: 0, size: 9999 },
      })
      .then((data) => setCategories(data?._embedded?.categories || []));
  }, [reloadData]);

  const handleAddCategory = async () => {
    if (inputValue.trim() === '') {
      setErrorTextField('Category name cannot be empty.');
      return;
    }
    setIsLoading(true);
    try {
      await restClient.post<Category>(CATEGORY_RESOURCE_PATH, {
        name: inputValue,
        type: selectedCategoryType,
      });
      setInputValue('');
      setReloadData((state) => !state);
    } catch (error) {
      extractErrorMessage(error, setErrorServer);
    }
    setIsLoading(false);
  };

  const handleRemoveCategory = async () => {
    if (!pendingRemoval) return;
    setIsLoading(true);
    try {
      await restClient.delete(`${CATEGORY_RESOURCE_PATH}/${pendingRemoval.id}`);
      setPendingRemoval(undefined);
      setReloadData((state) => !state);
    } catch (error) {
      extractErrorMessage(error, setErrorTextField);
    }
    setIsLoading(false);
  };

  const CategoryList = ({ items }: { items: Category[] }) => {
    return (
      <List>
        {items.map((category, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => setPendingRemoval(category)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={category.name} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Manage Categories
        </Typography>
        <Box
          display="flex"
          gap={FIELDS_SPACING}
          flexDirection="column"
          my={CONTENT_PADDING}
        >
          <TextField
            fullWidth
            label="New Category"
            variant="outlined"
            error={!!errorTextField}
            helperText={errorTextField}
            slotProps={{
              input: {
                endAdornment: (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddCategory}
                  >
                    Add
                  </Button>
                ),
              },
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
          />
          <RadioGroup
            row
            aria-labelledby="userType-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={selectedCategoryType}
            onChange={(value) => {
              setSelectedCategoryType(
                value.target.value as keyof typeof CategoryType
              );
            }}
          >
            <FormControlLabel
              value="TECHNOLOGY"
              control={<Radio />}
              label="Technology"
            />
            <FormControlLabel value="ROLE" control={<Radio />} label="Role" />
            <FormControlLabel
              value="LANGUAGE"
              control={<Radio />}
              label="Langauge"
            />
          </RadioGroup>
          {errorServer && <FormHelperText error>{errorServer}</FormHelperText>}
        </Box>
        <Typography variant="h6">Technologies</Typography>
        <CategoryList
          items={categories.filter(
            (c) => getEnumKey(CategoryType, CategoryType.TECHNOLOGY) === c.type
          )}
        />
        <Box my={FIELDS_SPACING} />
        <Typography variant="h6">Roles</Typography>
        <CategoryList
          items={categories.filter(
            (c) => getEnumKey(CategoryType, CategoryType.ROLE) === c.type
          )}
        />
        <Box my={FIELDS_SPACING} />
        <Typography variant="h6">Languages</Typography>
        <CategoryList
          items={categories.filter(
            (c) => getEnumKey(CategoryType, CategoryType.LANGUAGE) === c.type
          )}
        />
        <Box my={6} />
      </Container>
      <PageLoading open={isLoading} />
      <ConfirmModal
        open={!!pendingRemoval}
        description="Are you sure you want to delete this category?"
        onConfirm={handleRemoveCategory}
        onCancel={() => setPendingRemoval(undefined)}
      />
    </>
  );
};

export default CategoryManagement;
