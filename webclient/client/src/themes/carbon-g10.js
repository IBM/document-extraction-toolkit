/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import { defaultTheme } from 'react-admin'
import { g10 } from '@carbon/themes'
import { gray } from '@carbon/colors'
import {
  heading01,
  heading02,
  heading03,
  heading04,
  heading05,
  heading06,
  body01,
  body02,
  caption01,
  bodyCompact01,
  bodyCompact02,
} from '@carbon/type'
import { easings } from '@carbon/motion'

const carbonTheme = g10

const basic = {
  carbon: 'g10',
  ra_custom: {
    tableHeader: carbonTheme.layerAccent01,
    table: carbonTheme.layer01,
    trhover: carbonTheme.layerHover01,
    trbottom: carbonTheme.borderSubtle01,
    interactive: carbonTheme.interactive || "#4589ff",
  },
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: '1px solid #efefef',
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: [
      '"IBM Plex Sans"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // MUI and carbon have these inversed
    // Carbon - larger number = bigger, MUI - larger number = smaller
    h1: { ...heading06 },
    h2: { ...heading05 },
    h3: { ...heading04 },
    h4: { ...heading03 },
    h5: { ...heading02 },
    h6: { ...heading01 },
    body1: { ...body02 },
    body2: { ...body01 },
    caption: { ...caption01 },
    button: { ...bodyCompact02 },
    subtitle1: { ...bodyCompact02 },
    subtitle2: { ...bodyCompact01 },
    //todo: subtitle1, subtitle2, button, caption, overline
  },
  palette: {
    type: 'dark',
    primary: {
      // main: '#ff6e40',
      main: carbonTheme.backgroundBrand,
      contrastText: '#fff',
    },
    secondary: {
      main: carbonTheme.backgroundInverse,
      contrastText: '#fff',
    },
    error: {
      main: carbonTheme.supportError,
      contrastText: '#fff',
    },
    info: {
      main: carbonTheme.supportInfo,
      contrastText: '#fff',
    },
    success: {
      main: carbonTheme.supportSuccess,
      contrastText: '#fff',
    },
    grey: {
      100: gray[10],
      200: gray[20],
      300: gray[30],
      400: gray[40],
      500: gray[50],
      600: gray[60],
      700: gray[70],
      800: gray[80],
      900: gray[90],
      A100: gray[10],
      A200: gray[20],
      A400: gray[40],
      A700: gray[70],
    },
    text: {
      primary: carbonTheme.textPrimary,
      secondary: carbonTheme.textSecondary,
      disabled: carbonTheme.textDisabled,
    },
    divider: carbonTheme.borderSubtle00,
    background: {
      paper: carbonTheme.background,
      default: carbonTheme.background,
    },
  },
  transitions: {
    easing: {
      easeOut: easings.exit.productive,
      easeIn: easings.entrance.productive,
    },
  },
}

console.log(basic)

export default basic
