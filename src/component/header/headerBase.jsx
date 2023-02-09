import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useContext, useState} from "react";
import {Drawer} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {BaseRoute, getFromLocalStorage, LOCAL_STORAGE_KEYS} from "../../config/utils";
import RouteContext from "../../context/RouteContext";

// const actionMapDefault = {
//     ADD_ADMIN_USER: "Add a new admin user",
//     APPROVE_MANDATE: "Approve mandate",
//     APPROVE_NAME_MISMATCH: "Approve name mismatch",
//     CHANGE_EMAIL_MOBILE: "Change email address or mobile number",
//     GET_DOCUMENTS: "Get documents",
//     MOVE_TO_FETCH: "Move to fetch step",
//     RECREATE_LENDER_APPLICATION: "Recreate lender application",
// }

export default function HeaderBase(
    {actionMap}
) {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState(null)
    const {currentRoute, dispatch} = useContext(RouteContext)

    const getUserFromStorage = async() => {
        const user = getFromLocalStorage(LOCAL_STORAGE_KEYS.USER)
        await setUser(user)
    }

    useState(()=>{
        getUserFromStorage()
    }, [])

    const handleMenuClick = async () => {
        if(open) {
            await setOpen(false)
        } else {
            await setOpen(true)
        }
    }
    const handleMenuItemClick = (event, actionItem) => {
        dispatch({
            type: "CHANGE_ROUTE",
            payload: actionItem
        })
    }
    const handleLogoutClick = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
        window.location.reload(false);
    }
    const list = () => (
        <Box
            sx={{ width: 350 }}
            role="presentation"
            onClick={()=>handleMenuClick()}
            onKeyDown={()=>handleMenuClick()}
        >
            <Toolbar />
            <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={(event)=>{
                                handleMenuItemClick(event, null)
                            }}
                        >
                            <ListItemText primary={"Dashboard"} />
                        </ListItemButton>
                    </ListItem>
                <Divider />
                {
                    actionMap && Object.keys(actionMap).map((actionItem, index) => (
                        <div key={index}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={(event)=>{
                                        handleMenuItemClick(event, actionItem)
                                    }}
                                >
                                    <ListItemText primary={actionMap[actionItem]} />
                                </ListItemButton>
                            </ListItem>
                            {(index < Object.keys(actionMap).length-1)?<Divider />:<></>}
                        </div>
                    ))
                }
            </List>
        </Box>
    );
    return (
        <div style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 5,
        }}>
            <Box sx={{ flexGrow: 1}}>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={()=>handleMenuClick()}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            VOLT admin panel
                        </Typography>
                        <div style={{display: "flex", flexDirection: "row", gap: 20, alignItems: "center"}}>
                            {
                                (user && user.fullName) ? (
                                    <Typography variant="h10" component="div" sx={{flexGrow: 1}}>
                                        Hi, {user.fullName}
                                    </Typography>) : (<></>)
                            }
                            <Button color="inherit"
                                    onClick={()=>{handleLogoutClick()}}
                            >Logout</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <div>
               <Drawer
                   open = {open}
                   anchor= 'left'
                   children={list()}
               />
            </div>
        </div>
    );
}