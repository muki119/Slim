import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Avatar ,Tooltip, IconButton, Menu,MenuItem,ListItemIcon, Divider} from '@mui/material';
export default function NavigationBar({setOpenMenu, dashdata, openMenu, setcurrentThemeFunc, currentTheme, logoutproc}) {
    return <nav className='topbar'>
        {/*<span id='barwelcome'>{dashdata.user.firstname.charAt(0).toUpperCase()+dashdata.user.firstname.slice(1)} {dashdata.user.surname} ( {dashdata.user.username} )</span> */}
        {/*<button tabIndex={0} id='logout'onClick={logoutproc}><LogoutIcon/>Logout</button>*/}
        <Tooltip title="Account Settings">
            <IconButton disableRipple={true} onClick={(e) => { setOpenMenu(e.currentTarget); } }>
                <Avatar className='avatar'>{dashdata.user.firstname.charAt(0).toUpperCase()}{dashdata.user.surname.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
        </Tooltip>
        <Menu id='Menu' anchorEl={openMenu} open={Boolean(openMenu)} onClose={(e) => { setOpenMenu(false); } } onClick={(e) => { setOpenMenu(false); } }>
            <MenuItem onClick={() => { navigator.clipboard.writeText(dashdata.user.username); } }>{dashdata.user.username}</MenuItem>
            <Divider />
            <MenuItem onClick={setcurrentThemeFunc}>
                <ListItemIcon>
                    {(currentTheme === "light") ? <DarkModeIcon className='lightanddarkicons' /> : <LightModeIcon className='lightanddarkicons' />}
                </ListItemIcon>
                {(currentTheme === "light") ? <>Toggle Dark Theme</> : <>Toggle Light Theme</>}
            </MenuItem>
            <Divider />
            <MenuItem onClick={logoutproc}>
                <ListItemIcon>
                    <LogoutIcon id="logout-icon" fontSize="medium" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>


    </nav>;
}