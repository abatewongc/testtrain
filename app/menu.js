// @flow
const fs = require('fs');

import { app, Menu, shell, BrowserWindow, dialog } from 'electron';
import React, { Component } from 'react';

export default class MenuBuilder {
  mainWindow: BrowserWindow;
  projectDirectory: null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  createProjectModalWindow() {
    let options = {
      parent: this.mainWindow,
      height: 400,
      width: 600,
      maxHeight: 400,
      maxWidth: 600,
      modal: true,
      show: false,
      autoHideMenuBar: true
    }
    let child = new BrowserWindow(options);
    child.loadURL(`file://${__dirname}/create-project-modal-window.html`)
    child.once('ready-to-show', () => {
      child.show()
    })
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    /* Unused Darwin code since working with Windows machine */
     const template = /* process.platform === 'darwin'
       ? this.buildDarwinTemplate()
      :*/ this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  /* Unused Darwin code since working with Windows machine */
  // buildDarwinTemplate() {
  //   const subMenuAbout = {
  //     label: 'Electron',
  //     submenu: [
  //       {
  //         label: 'About ElectronReact',
  //         selector: 'orderFrontStandardAboutPanel:'
  //       },
  //       { type: 'separator' },
  //       { label: 'Services', submenu: [] },
  //       { type: 'separator' },
  //       {
  //         label: 'Hide ElectronReact',
  //         accelerator: 'Command+H',
  //         selector: 'hide:'
  //       },
  //       {
  //         label: 'Hide Others',
  //         accelerator: 'Command+Shift+H',
  //         selector: 'hideOtherApplications:'
  //       },
  //       { label: 'Show All', selector: 'unhideAllApplications:' },
  //       { type: 'separator' },
  //       {
  //         label: 'Quit',
  //         accelerator: 'Command+Q',
  //         click: () => {
  //           app.quit();
  //         }
  //       }
  //     ]
  //   };
  //   const subMenuEdit = {
  //     label: 'Edit',
  //     submenu: [
  //       { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
  //       { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
  //       { type: 'separator' },
  //       { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
  //       { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
  //       { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
  //       {
  //         label: 'Select All',
  //         accelerator: 'Command+A',
  //         selector: 'selectAll:'
  //       }
  //     ]
  //   };
  //   const subMenuViewDev = {
  //     label: 'View',
  //     submenu: [
  //       {
  //         label: 'Reload',
  //         accelerator: 'Command+R',
  //         click: () => {
  //           this.mainWindow.webContents.reload();
  //         }
  //       },
  //       {
  //         label: 'Toggle Full Screen',
  //         accelerator: 'Ctrl+Command+F',
  //         click: () => {
  //           this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
  //         }
  //       },
  //       {
  //         label: 'Toggle Developer Tools',
  //         accelerator: 'Alt+Command+I',
  //         click: () => {
  //           this.mainWindow.toggleDevTools();
  //         }
  //       }
  //     ]
  //   };
  //   const subMenuViewProd = {
  //     label: 'View',
  //     submenu: [
  //       {
  //         label: 'Toggle Full Screen',
  //         accelerator: 'Ctrl+Command+F',
  //         click: () => {
  //           this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
  //         }
  //       }
  //     ]
  //   };
  //   const subMenuWindow = {
  //     label: 'Window',
  //     submenu: [
  //       {
  //         label: 'Minimize',
  //         accelerator: 'Command+M',
  //         selector: 'performMiniaturize:'
  //       },
  //       { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
  //       { type: 'separator' },
  //       { label: 'Bring All to Front', selector: 'arrangeInFront:' }
  //     ]
  //   };
  //   const subMenuHelp = {
  //     label: 'Help',
  //     submenu: [
  //       {
  //         label: 'Learn More',
  //         click() {
  //           shell.openExternal('http://electron.atom.io');
  //         }
  //       },
  //       {
  //         label: 'Documentation',
  //         click() {
  //           shell.openExternal(
  //             'https://github.com/atom/electron/tree/master/docs#readme'
  //           );
  //         }
  //       },
  //       {
  //         label: 'Community Discussions',
  //         click() {
  //           shell.openExternal('https://discuss.atom.io/c/electron');
  //         }
  //       },
  //       {
  //         label: 'Search Issues',
  //         click() {
  //           shell.openExternal('https://github.com/atom/electron/issues');
  //         }
  //       }
  //     ]
  //   };
  //
  //   const subMenuView =
  //     process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;
  //
  //   return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  // }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&New',
            submenu: [
              {
                label: '&Project',
                accelerator: 'Ctrl+Shift+N',
                click: () => {
                  this.createProjectModalWindow();
                  // var options = {
                  //   title: 'Choose TestTrain Project Directory',
                  //   properties: ['openDirectory']
                  // };
                  // var dirName = dialog.showOpenDialog(this.mainWindow, options, (filePath) => {
                  //   if(filePath.length > 0) {
                  //     this.projectDirectory = filePath[0];
                  //     console.log(this.projectDirectory);
                  //   }
                  // });
                }
              },
              {
                label: '&Test Case',
                accelerator: 'Ctrl+N'
              }
            ]
          },
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
            click: () => {
              var options = {
                title: 'Open TestTrain Project',
                properties: ['openFile']
              };
              var dirName = dialog.showOpenDialog(this.mainWindow, options, (filePath) => {
                console.log(filePath);
              });
            }
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      }
    ];

    return templateDefault;
  }
}
