import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Typography} from "@mui/material";
import {convertEpochToDateAndTime} from "../../config/utils";

function AuditTable({
    data = [],
}) {
    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 700 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"
                                       colSpan={data && data[0] ? Object.keys(data[0]).length : 100}
                                       style={{backgroundColor:'#1976d2', color: 'white', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                                    <Typography fontSize="h6">
                                        Audit Log
                                    </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {
                                data && data[0] ? (
                                    Object.keys(data[0]).map((column, index) => (
                                        <TableCell
                                            key={column}
                                            align="left"
                                            style={{top: 57, backgroundColor:'#1976d2', color: 'white' }}
                                        >
                                            <Typography>{column}</Typography>
                                        </TableCell>))
                                    ) : (<></>)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data && data[0] && data.map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {
                                            data && data[0] && Object.keys(data[0]).map((column, index) => {
                                                const value = row[column];
                                                if(column === "actionExecutedOn") {
                                                    return (
                                                        <TableCell key={column+index} align="left">
                                                            {
                                                                value && convertEpochToDateAndTime(value)
                                                            }
                                                        </TableCell>
                                                    );
                                                }
                                                return (
                                                    <TableCell key={column+index} align="left">
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default AuditTable;