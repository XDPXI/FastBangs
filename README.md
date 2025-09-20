
---

<h1 align="center">FastBangs</h1>
<p align="center">A fork of Und*ck that provides QoL features</p>

---

## FastBangs

A fork of Und*ck that provides QoL features

---

## Unduck

DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables all
of DuckDuckGo's bangs to work, but much faster.

---

## How is it that much faster?

DuckDuckGo does their redirects server side. Their DNS is...not always great. Result is that it often takes ages.

I solved this by doing all of the work client side. Once you've went to [FastBangs](https://fastbangs.xdpxi.dev) once, the JS is all cache'd
and will never need to be downloaded again. Your device does the redirects, not me.

---

## Browser Setup

To use FastBangs, you need to set it as your default search engine in your browser. Use the following URL as your search
engine:

```
https://fastbangs.xdpxi.dev?q=%s
```

For specific browser configuration instructions, refer to these guides:

- **Chrome**: [Set default search engine and site search shortcuts](https://support.google.com/chrome/answer/95426)
- **Firefox**: [Change your default search settings in Firefox](https://support.mozilla.org/en-US/kb/change-your-default-search-settings-firefox)
- **Edge**: [Change your default search engine in Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/change-your-default-search-engine-in-microsoft-edge-cccaf51c-a4df-a43e-8036-d4d2c527a791)
- **Brave**: [How do I set my default search engine?](https://support.brave.com/hc/en-us/articles/360017479752-How-do-I-set-my-default-search-engine)

---
