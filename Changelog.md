# Version 2.0.4 #
  * Added HTTP 204 No Content response status as a successful request ([issue 94](https://code.google.com/p/kbsslenforcer/issues/detail?id=94))
  * Stopped redirecting sub\_frame's, since they always end up as mixed content. Either non-SSL parent frame which doesn't allow SSL sub\_frame's or SSL parent which blocks non-SSL requests before we get to redirect them ([issue 94](https://code.google.com/p/kbsslenforcer/issues/detail?id=94))
  * Minor code improvement, for a rare issue
  * Removed www agnostic feature ([issue 88](https://code.google.com/p/kbsslenforcer/issues/detail?id=88))

# Version 2.0.3 #
  * Further improved redirect detection

# Version 2.0.2 #
  * Minor code clean-up and optimizations

# Version 2.0.1 #
  * Improved redirect detection, resulting in less infinite loops ([issue 96](https://code.google.com/p/kbsslenforcer/issues/detail?id=96))
  * Changed domain validation to accept input in the options page for local domains without a TLD ([issue 92](https://code.google.com/p/kbsslenforcer/issues/detail?id=92))

# Version 2.0.0 #
  * Rewrite to support the new webRequest event handlers ([issue 25](https://code.google.com/p/kbsslenforcer/issues/detail?id=25))
  * Added the browser button, which was in a separate extension before ([issue 38](https://code.google.com/p/kbsslenforcer/issues/detail?id=38))
  * Permission change to be able to use the new webRequest event handlers and the added browser button
  * Changed the wording of the whitelist and blacklist, to the clearer enforced and ignored lists ([issue 31](https://code.google.com/p/kbsslenforcer/issues/detail?id=31))
  * Fixed some bugs as a side-effect of using the webRequest handlers instead of the old method
    * [Issue 65](https://code.google.com/p/kbsslenforcer/issues/detail?id=65):	Extension causes some links to be rewritten incorrectly as https://...:80/...
    * [Issue 16](https://code.google.com/p/kbsslenforcer/issues/detail?id=16):	POST requests get redirected as GET requests without the POST parameters
    * [Issue 4](https://code.google.com/p/kbsslenforcer/issues/detail?id=4):	Gives up on 301 and 302 redirects
    * [Issue 71](https://code.google.com/p/kbsslenforcer/issues/detail?id=71):	Script downloads entire JQuery source each time

# Version 1.0.20 #
  * Created a pause option in the browser button ([issue 34](https://code.google.com/p/kbsslenforcer/issues/detail?id=34))

# Version 1.0.19 #
  * The auto-blacklisting of sites that redirect to HTTP to avoid infinite loops fixed to be more specific ([issue 47](https://code.google.com/p/kbsslenforcer/issues/detail?id=47))

# Version 1.0.18 #
  * Fixed a minor regression error which broke re-detections requested via the browser button

# Version 1.0.17 #
  * Set a timeout, so the extension doesn't hang ([issue 39](https://code.google.com/p/kbsslenforcer/issues/detail?id=39))
  * Updated the browser button extension to include a message to inform that it won't have an effect when in incognito mode

# Version 1.0.16 #
  * Created the ability to clear the whitelist and blacklist ([issue 23](https://code.google.com/p/kbsslenforcer/issues/detail?id=23))
  * Added support for [the browser button](https://chrome.google.com/extensions/detail/offhddbjgcdlkhfoolhpooeapdninhfp) ([issue 13](https://code.google.com/p/kbsslenforcer/issues/detail?id=13)):

# Version 1.0.15 #
  * Updated the link fixer for SSL pages to be more robust

# Version 1.0.14 #
  * Fixed a bug where it would change links to SSL on blacklisted sites, when they were visited over SSL ([issue 35](https://code.google.com/p/kbsslenforcer/issues/detail?id=35)).

# Version 1.0.13 #
  * Changed the domain validation regex to be generic for any TLD regardless of its usage

# Version 1.0.12 #
  * Fixed a bug where it would download some pages when detecting SSL ([issue 15](https://code.google.com/p/kbsslenforcer/issues/detail?id=15))

# Version 1.0.11 #
  * Added a red X next to each domain on the whitelist and blacklist, which will remove the domain from the list when you click on it ([issue 14](https://code.google.com/p/kbsslenforcer/issues/detail?id=14))
  * Added a domain check, so it'll tell you if you typed in an invalid domain

# Version 1.0.10 #
  * Can now show the whitelisted and blacklisted domains from the options page ([issue 10](https://code.google.com/p/kbsslenforcer/issues/detail?id=10))
  * Minor brush-up of the options page

# Version 1.0.9 #
  * Fixed a bug in saving manual whitelistings and blacklistings ([issue 9](https://code.google.com/p/kbsslenforcer/issues/detail?id=9))

# Version 1.0.8 #
  * Added notification so you can see that it's redetected/whitelisted/blacklisted your domain and also notifies you that there's a difference between domains with and without www ([issue 7](https://code.google.com/p/kbsslenforcer/issues/detail?id=7))

# Version 1.0.7 #
  * Added support for incognito mode, which means in incognito mode it still detects and enforces SSL/TLS when available, but it doesn't save the results

# Version 1.0.6 #
  * Added an option to detect both with and without www subdomain ([issue 5](https://code.google.com/p/kbsslenforcer/issues/detail?id=5))

# Version 1.0.5 #
  * Fixed a part that was missed on the previous regression error

# Version 1.0.4 #
  * Fixed a regression error from the 1.0.3 update

# Version 1.0.3 #
  * Fixed a permission error

# Version 1.0.2 #
  * Now does a GET request if a HEAD request isn't allowed

# Version 1.0.1 #
  * Added linkfix on inserted links after page load

# Version 1.0 #
  * Simplified the options

# Version 0.9.2 #
  * Change links to use SSL when available (fixes [issue 3](https://code.google.com/p/kbsslenforcer/issues/detail?id=3))

# Version 0.9.1 #
  * Set auto-detection as default (upgrades will keep their setting)
  * Added possibility to whitelist, blacklist and redetect sites from the auto-detection

# Version 0.9 #
  * Experimental support for detecting SSL support automatically

# Version 0.8 #
  * Adds ability to disable sites from the feed

# Version 0.7 #
  * Added a feed that'll be updated with the extension

# Version 0.6 #
  * Simplified the options a bit

# Version 0.5 #
  * Initial release