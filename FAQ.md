If you have any questions that aren't answered here or are experiencing any issues, please create an issue on the issue tracker.

# What does the extension do? #
This extension enforces encryption for websites that support it as much as currently possible in Chrome. This gives you added security and privacy for your browsing automatically and transparently. This is particularly important on insecure networks, such as public wifi in e.g. coffee shops and hotels.

# Is it secure against MITM/Firesheep attacks? #
It is not completely secure against the infamous Firesheep or other MITM attacks, but it does minimize the risk greatly.

Due to Chrome limitations KB SSL Enforcer detects SSL on the very first visit to a page and is unable to block the unencrypted request from going through while this is happening. It will let that page load and if it is detected to support SSL, all subsequent requests to that domain will be enforced automatically to use SSL before the unencrypted request is sent from the browser.

The unencrypted request only goes through on the very first page visit where it's detecting SSL support. The setting will be saved and survives reboots and all. The only way to stop enforcing SSL is to manually set it to ignore SSL on that domain or if the extension detects that the site is trying to enforce an unencrypted connection and therefore backs off by not enforcing it from then on.

This first insecure request could send a cookie in the clear, which would give anyone with tools like Firesheep an opportunity to use your account on that site. But this only happens if they catch it during that first request and if it includes sensitive information, such as your logged in session. All subsequent requests, even after restarting the browser and rebooting the computer, will enforce encryption.

# How does the redetect feature work? #

The redetect feature under options and the browser button will remove a single domain from the enforced list or ignored list if it's there and you will therefore get the automatic redetection next time you visit that site.

# Is it safe to allow in incognito? #

The extension has been made to not save any information in incognito. However, if you're more paranoid about local privacy than MITM attacks, you could avoid allowing incognito to be extra extra safe.

# Permissions #
The [manifest file](https://github.com/kbjorgensen/kbsslenforcer/blob/master/chrome%20extension/manifest.json) states the permissions requested:
  * `*://*/`
    * This is for accessing pages on all domains and both with and without SSL
  * tabs
    * This is for accessing information on whether a tab is in incognito, so it can be respected
  * webRequest
    * This is for intercepting the unencrypted requests and detecting whether the site doesn't support encryption by redirecting encrypted requests to the unencrypted site
  * webRequestBlocking
    * This is for blocking the unencrypted requests while determining whether it needs to be redirected

The project is open source and any scrutiny of the code or the extension's behavior is encouraged. If you have any comments, please open an issue on the [issue tracker](https://github.com/kbjorgensen/kbsslenforcer/issues).

# Privacy policy #

The extension locally stores a list of domains that have been visited, split in to an SSL enforced and an ignored list. These lists can be seen and edited on the options page. The enforced list is used for redirecting requests to use SSL. The ignored list is used to avoid autodetecting SSL every time you visit a site. No other information is saved and none of it is sent anywhere.

# Still having trouble? #

If you've read through the FAQ and you still have any questions or issues, then please search all issues in the issue tracker (including the closed ones) and/or perhaps open a new issue on the [issue tracker](https://github.com/kbjorgensen/kbsslenforcer/issues).
