import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar ,Tooltip, IconButton, Menu,MenuItem,ListItemIcon, Divider} from '@mui/material';
export default function NavigationBar({setOpenMenu, dashdata, openMenu, setcurrentThemeFunc, currentTheme, logoutproc,opencb,openChatbar}) {
    return <nav className='topbar'>
        {/*<span id='barwelcome'>{dashdata.user.firstname.charAt(0).toUpperCase()+dashdata.user.firstname.slice(1)} {dashdata.user.surname} ( {dashdata.user.username} )</span> */}
        {/*<button tabIndex={0} id='logout'onClick={logoutproc}><LogoutIcon/>Logout</button>*/}
        <Tooltip title={openChatbar?'Close Menu':'Open Menu'}>
            <IconButton disableRipple={true} onClick={opencb}>
                <MenuIcon className='menuicon'/>
            </IconButton>
        </Tooltip>

        <Tooltip title="Account Settings">
            <IconButton disableRipple={true} onClick={(e) => { setOpenMenu(e.currentTarget); } }>
                <Avatar className='avatar'>{dashdata.user.firstname.charAt(0).toUpperCase()}{dashdata.user.surname.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
        </Tooltip>

        <Menu id='Menu' anchorEl={openMenu} open={Boolean(openMenu)} onClose={(e) => { setOpenMenu(false); } } >
            <Tooltip title="Copy Username">
                <MenuItem onClick={() => { navigator.clipboard.writeText(dashdata.user.username); } }>
                    {dashdata.user.username}
                </MenuItem>
            </Tooltip>

            <Divider />

            <MenuItem onClick={setcurrentThemeFunc}>
                <ListItemIcon>
                    {(currentTheme === "light") ? <DarkModeOutlinedIcon className='lightanddarkicons' /> :<> {(currentTheme === null)?<LightModeIcon className='lightanddarkicons' />:<DevicesIcon  className='lightanddarkicons' />}</>}
                </ListItemIcon>
                {(currentTheme === "light") ? <>Toggle Dark Theme</> : <>{(currentTheme === null)?<>Toggle Light Theme</>:<>Use Device Theme</> }</>  }
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