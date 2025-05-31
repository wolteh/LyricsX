//
//  PreferenceLabViewController.swift
//  LyricsX - https://github.com/ddddxxx/LyricsX
//
//  This Source Code Form is subject to the terms of the Mozilla Public
//  License, v. 2.0. If a copy of the MPL was not distributed with this
//  file, You can obtain one at https://mozilla.org/MPL/2.0/.
//

import Cocoa

class PreferenceLabViewController: NSViewController {
    
    @IBOutlet weak var enableTouchBarLyricsButton: NSButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        #if IS_FOR_MAS
            enableTouchBarLyricsButton.state = .off
            enableTouchBarLyricsButton.target = self
            enableTouchBarLyricsButton.action = #selector(mas_enableTouchBarLyricsAction)
        #else
            enableTouchBarLyricsButton.bind(.value, withDefaultName: .touchBarLyricsEnabled)
        #endif
    }
    
    @IBAction func mas_enableTouchBarLyricsAction(_ sender: NSButton) {
        sender.state = .off
        let alert = NSAlert()
        alert.messageText = NSLocalizedString("Unable to enable Touch Bar lyrics.", comment: "alert title")
        alert.informativeText = NSLocalizedString("Touch Bar lyrics is not supported in Mac App Store Version. Please download on GitHub.", comment: "")
        alert.addButton(withTitle: NSLocalizedString("OK", comment: ""))
        alert.addButton(withTitle: NSLocalizedString("Download", comment: ""))
        let handler = { (response: NSApplication.ModalResponse) in
            if response == .alertSecondButtonReturn {
                let url = URL(string: "https://github.com/XQS6LB3A/LyricsX/releases")!
                NSWorkspace.shared.open(url)
            }
        }
        if let window = view.window {
            alert.beginSheetModal(for: window, completionHandler: handler)
        } else {
            handler(alert.runModal())
        }
    }
    
    @IBAction func customizeTouchBarAction(_ sender: NSButton) {
        if #available(OSX 10.12.2, *) {
            NSApplication.shared.toggleTouchBarCustomizationPalette(sender)
        } else {
            // Fallback on earlier versions
        }
    }
}
