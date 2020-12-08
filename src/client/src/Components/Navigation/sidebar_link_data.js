import React from 'react';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';

export const sidebar_data = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <MdIcons.MdDashboard />,
        cName: 'nav-text'
    },
    {
        title: 'Lobby',
        path: '/lobby',
        icon: <MdIcons.MdGroupWork />,
        cName: 'nav-text'
    },
    {
        title: 'Summary',
        path: '/summary',
        icon: <BiIcons.BiStats />,
        cName: 'nav-text'
    }
];

