/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const { St, Clutter, GObject, Gio } = imports.gi;
const {
    main: Main,
    messageTray: MessageTray,
    panelMenu: PanelMenu,
    popupMenu: PopupMenu,
} = imports.ui;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let panelButton, originalShowNotification;




const NHPopup = GObject.registerClass(
    class NHPopup extends PanelMenu.Button {
    
      _init () {
    
        super._init(0);
    
        let icon = new St.Icon({
          icon_name : 'security-low-symbolic',
          style_class : 'system-status-icon',
        });
    
        this.add_child(icon);
    
        let pmItem = new PopupMenu.PopupMenuItem('Normal Menu Item', {style_class: 'asas'});
        pmItem.add_child(new St.Label({text : 'Label added to the end'}));
        this.menu.addMenuItem(pmItem);
    
        pmItem.connect('activate', () => {
          log('clicked');
        });
    
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    
        this.menu.addMenuItem(
          new PopupMenu.PopupMenuItem(
            "User cannot click on this item",
            {reactive : false},
          )
        );
    
        this.menu.connect('open-state-changed', (menu, open) => {
          if (open) {
            log('opened');
          } else {
            log('closed');
          }
        });
    
        // sub menu
        let subItem = new PopupMenu.PopupSubMenuMenuItem('sub menu item');
        this.menu.addMenuItem(subItem);
        subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem('item 1'));
        subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem('item 2'), 0);
    
        // section
        let popupMenuSection = new PopupMenu.PopupMenuSection();
        popupMenuSection.actor.add_child(new PopupMenu.PopupMenuItem('section'));
        this.menu.addMenuItem(popupMenuSection);
    
        // image item
        let popupImageMenuItem = new PopupMenu.PopupImageMenuItem(
          'Menu Item with Icon',
          'security-high-symbolic',
        );
        this.menu.addMenuItem(popupImageMenuItem);
    
        // you can close, open and toggle the menu with
        // this.menu.close();
        // this.menu.open();
        // this.menu.toggle();
      }
    });




function init() {
    log('log init -----------------------------------');
}

function enable() {
    modifyNotificationObject();
    attachNHPopup();
}
 
function disable() {
    resetNotificationToOriginal()
    removeNHPopup();

}

function attachNHPopup() {
    Main.panel.addToStatusArea('Notification history', new NHPopup(), 1);
    
}

function createButton() {
    panelButton = new St.Bin({
        style_class : "panel-button",
    });
    let panelButtonText = new St.Label({
        text : "Hello World",
        y_align: Clutter.ActorAlign.CENTER,
    });
    panelButton.set_child(panelButtonText);
}

function removeNHPopup() {
    NHPopup.destroy();
}

function modifyNotificationObject() {
    if (MessageTray.Source.prototype.showNotification === originalShowNotification) {
        return;
    }
    originalShowNotification = MessageTray.Source.prototype.showNotification
    MessageTray.Source.prototype.showNotification = showNotification;
}

function resetNotificationToOriginal() {
    MessageTray.Source.prototype.showNotification = originalShowNotification;
}

function collectDate(notification) {
    return {
        title: notification.title,
        bannerBodyText: notification.bannerBodyText,
        dateTime: formatDate(notification.datetime)
    }
}

function showNotification(notification) {
    originalShowNotification.call(this, notification);
    const data = collectDate(notification)
}


function formatDate(date, format = "%Y-%m-%d %H:%M:%S") {
    return date.format(format);
}


function myLog(data) {
    log('log mylog start')
    const arrKeys = Object.keys(data);
    arrKeys.forEach((item, key) => {
        log('log', (typeof data[arrKeys[key]]), arrKeys[key], data[arrKeys[key]])
    })
    log('log mylog end')
}







