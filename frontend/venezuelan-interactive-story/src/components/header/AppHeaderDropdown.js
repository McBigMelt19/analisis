import React from 'react';
import { CNavItem, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilSettings, cilLogout } from '@coreui/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../config/auth';

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle caret={false}>
        <CIcon icon={cilUser} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;