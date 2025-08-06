/**
 * Custom Embed Tool for EditorJS
 * Based on the Test_Editorjs implementation with enhanced service support
 */

// Embed services configuration
const EMBED_SERVICES = {
  vimeo: {
    regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
    embedUrl: "https://player.vimeo.com/video/<%= remote_id %>?title=0&byline=0",
    html: '<iframe style="width:100%;" height="320" frameborder="0"></iframe>',
    height: 400,
    width: 400
  },
  youtube: {
    regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
    embedUrl: "https://www.youtube.com/embed/<%= remote_id %>",
    html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
    height: 400,
    width: 400,
    id: ([id, params]) => {
      if (!params && id) {
        return id;
      }

      const paramsMap = {
        start: "start",
        end: "end",
        t: "start",
        time_continue: "start",
        list: "list"
      };

      params = params
        .slice(1)
        .split("&")
        .map(param => {
          const [name, value] = param.split("=");

          if (!id && name === "v") {
            id = value;
            return;
          }

          if (!paramsMap[name]) return;

          return `${paramsMap[name]}=${value}`;
        })
        .filter(param => !!param);

      return id + "?" + params.join("&");
    }
  },
  coub: {
    regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
    embedUrl: "https://coub.com/embed/<%= remote_id %>",
    html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
    height: 320,
    width: 580
  },
  codepen: {
    regex: /https?:\/\/codepen\.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
    embedUrl: "https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2",
    html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
    height: 300,
    width: 600,
    id: ids => ids.join("/embed/")
  },
  twitter: {
    regex: /https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/,
    embedUrl: "https://twitter.com/<%= remote_id %>",
    html: '<div style="width:100%; height:200px; display:flex; align-items:center; justify-content:center; border:1px solid #e1e8ed; border-radius:8px;"><a href="<%= source %>" target="_blank" style="color:#1da1f2; text-decoration:none;">View Tweet</a></div>',
    height: 350,
    width: 350,
    id: ids => `${ids[0]}/status/${ids[1]}`
  }
};

/**
 * Custom Embed Tool Class
 */
export default class CustomEmbed {
  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-67 49v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this._data = {
      service: data.service || '',
      source: data.source || '',
      embed: data.embed || '',
      width: data.width || 580,
      height: data.height || 320,
      caption: data.caption || ''
    };

    this.element = null;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('embed-tool');
    this.element = wrapper;

    if (this._data.source) {
      this._renderEmbed(wrapper);
    } else {
      this._renderInput(wrapper);
    }

    return wrapper;
  }

  _renderInput(wrapper) {
    const input = document.createElement('input');
    input.placeholder = 'Paste a link to embed content (YouTube, Vimeo, CodePen, Twitter, etc.)';
    input.classList.add('embed-tool__input');
    input.style.cssText = `
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    `;

    input.addEventListener('paste', (event) => {
      setTimeout(() => {
        this.processUrl(input.value.trim());
      }, 100);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.processUrl(input.value.trim());
      }
    });

    wrapper.appendChild(input);

    // Focus with a small delay to ensure the element is in the DOM
    setTimeout(() => {
      input.focus();
    }, 10);
  }

  showInput() {
    if (!this.element) {
      console.error('Element not initialized');
      return;
    }

    this.element.innerHTML = '';
    this._renderInput(this.element);
  }

  _renderEmbed(wrapper) {
    const { service, source, embed, width, height, caption } = this._data;

    const container = document.createElement('div');
    container.classList.add('embed-tool__content');

    let embedHtml = '';

    if (embed) {
      embedHtml = embed;
    } else if (service && EMBED_SERVICES[service]) {
      const serviceConfig = EMBED_SERVICES[service];
      const match = source.match(serviceConfig.regex);

      if (match) {
        let remoteId = match[1];
        if (serviceConfig.id && typeof serviceConfig.id === 'function') {
          remoteId = serviceConfig.id(match.slice(1));
        }

        const embedUrl = serviceConfig.embedUrl.replace('<%= remote_id %>', remoteId);
        embedHtml = serviceConfig.html.replace('<%= source %>', source);

        if (embedHtml.includes('<iframe')) {
          embedHtml = embedHtml.replace('<iframe', `<iframe src="${embedUrl}"`);
        }
      }
    }

    if (!embedHtml) {
      embedHtml = `<div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
        <a href="${source}" target="_blank" style="color: #3b82f6; text-decoration: none;">View Content</a>
      </div>`;
    }

    container.innerHTML = embedHtml;

    if (caption) {
      const captionEl = document.createElement('div');
      captionEl.classList.add('embed-tool__caption');
      captionEl.contentEditable = !this.readOnly;
      captionEl.innerHTML = caption;
      captionEl.style.cssText = `
        margin-top: 8px;
        font-size: 14px;
        color: #6b7280;
        text-align: center;
      `;

      if (!this.readOnly) {
        captionEl.addEventListener('blur', () => {
          this._data.caption = captionEl.innerHTML;
        });
      }

      container.appendChild(captionEl);
    }

    wrapper.appendChild(container);
  }

  showEmbed() {
    if (!this.element) {
      console.error('Element not initialized');
      return;
    }

    this.element.innerHTML = '';
    this._renderEmbed(this.element);
  }

  processUrl(url) {
    if (!url) return;

    this._data.source = url;

    // Detect service
    for (const [serviceName, serviceConfig] of Object.entries(EMBED_SERVICES)) {
      if (serviceConfig.regex.test(url)) {
        this._data.service = serviceName;
        this._data.width = serviceConfig.width;
        this._data.height = serviceConfig.height;
        break;
      }
    }

    // Re-render as embed
    if (this.element) {
      this.element.innerHTML = '';
      this._renderEmbed(this.element);
    }
  }

  save() {
    return this._data;
  }

  validate(savedData) {
    return savedData.source || savedData.embed;
  }

  static get sanitize() {
    return {
      service: {},
      source: {},
      embed: {},
      width: {},
      height: {},
      caption: {
        br: true,
        strong: true,
        em: true,
        a: {
          href: true,
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }
    };
  }
}
