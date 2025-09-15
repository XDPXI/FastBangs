import {bangs} from "./bang";
import "./global.css";

// Default search engines for when no bang is used
const DEFAULT_SEARCH_ENGINES = [
    {name: "Google", value: "google", url: "https://www.google.com/search?q={{{s}}}"},
    {name: "Google (No AI)", value: "google-no-ai", url: "https://www.google.com/search?udm=14&q={{{s}}}"},
    {name: "DuckDuckGo", value: "duckduckgo", url: "https://duckduckgo.com/?q={{{s}}}"},
    {name: "DuckDuckGo (HTML)", value: "duckduckgo-html", url: "https://html.duckduckgo.com/html/?q={{{s}}}"},
    {name: "Brave Search", value: "brave", url: "https://search.brave.com/search?q={{{s}}}"},
    {name: "Swisscows", value: "swisscows", url: "https://swisscows.com/web?query={{{s}}}"},
    {name: "Startpage", value: "startpage", url: "https://www.startpage.com/sp/search?query={{{s}}}"},
    {name: "Qwant", value: "qwant", url: "https://www.qwant.com/?q={{{s}}}"}
];

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>FastBangs</h1>
        <p>A fork of Und*ck to set the main search engine to Brave Search</p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://fastbangs.xdpxi.dev?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        <div class="button-container">
        <div class="settings-panel open">
          <div class="settings-content">
            <h3>Search Customization</h3>
            <div class="setting-group">
              <label for="default-search-select">Default search engine (when no bang is used):</label>
              <select id="default-search-select" class="search-select">
                ${DEFAULT_SEARCH_ENGINES.map(engine =>
      `<option value="${engine.value}">${engine.name}</option>`
  ).join('')}
              </select>
              <p class="setting-description">This search engine will be used when you search without a bang (like "!g" or "!gh")</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;
    const customizeButton = app.querySelector<HTMLButtonElement>(".customize-button")!;
    const settingsPanel = app.querySelector<HTMLDivElement>(".settings-panel")!;
    const defaultSearchSelect = app.querySelector<HTMLSelectElement>("#default-search-select")!;

    // Load saved default search engine
    const savedDefaultSearch = localStorage.getItem("default-search-engine") || "brave";
    defaultSearchSelect.value = savedDefaultSearch;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });

    defaultSearchSelect.addEventListener("change", (e) => {
        const target = e.target as HTMLSelectElement;
        localStorage.setItem("default-search-engine", target.value);
    });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "brave";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);
  const bangCandidate = match?.[1]?.toLowerCase();

    if (bangCandidate) {
        // Bang detected - use existing logic
        const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

        // Remove the first bang from the query
        const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

        // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
        if (cleanQuery === "")
            return selectedBang ? `https://${selectedBang.d}` : null;

        // Format of the url is:
        // https://www.google.com/search?q={{{s}}}
        const searchUrl = selectedBang?.u.replace(
            "{{{s}}}",
            // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
            encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
        );
        if (!searchUrl) return null;

        return searchUrl;
    } else {
        // No bang detected - use default search engine
        const defaultSearchEngine = localStorage.getItem("default-search-engine") || "brave";
        const engine = DEFAULT_SEARCH_ENGINES.find(e => e.value === defaultSearchEngine);

        if (!engine) return null;

        return engine.url.replace("{{{s}}}", encodeURIComponent(query));
    }
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();