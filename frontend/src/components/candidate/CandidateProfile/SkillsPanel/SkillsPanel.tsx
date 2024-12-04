import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Skill from '../../../../models/Skill';
import Panel from '../Panel/Panel';

const StyledBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
}));

interface Props {
  skills?: Skill[];
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SkillsPanel = ({ skills }: Props) => {
  return (
    <Panel title="Skills">
      {skills && skills.length > 0 ? (
        <StyledBox>
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Years of expereice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills?.map((skill, index) => (
                  <StyledTableRow key={index}>
                    <TableCell align="left">{skill.name}</TableCell>
                    <TableCell align="right">
                      {skill.yearOfExperience}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledBox>
      ) : (
        'N/A'
      )}
    </Panel>
  );
};

export default SkillsPanel;
