import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {convertEpochToDateAndTime} from "../../config/utils";

// const columns = [
//     { id: 'name', label: 'Name', minWidth: 170 },
//     { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//     {
//         id: 'population',
//         label: 'Population',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 'size',
//         label: 'Size\u00a0(km\u00b2)',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 'density',
//         label: 'Density',
//         minWidth: 170,
//         align: 'right',
//         format: (value) => value.toFixed(2),
//     },
// ];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];


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
                                       colSpan={Object.keys(data[0]).length}
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
                                                                convertEpochToDateAndTime(value)
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