/**
 * MCurator Forum module — Reddit × GitHub Discussions style.
 * Loaded inline in UI.html for local static preview.
 * External APIs: PubMed, Europe PMC, Crossref, Semantic Scholar, ORCID, OpenAlex, Zenodo, arXiv (q-bio 等), GDELT; optional Elicit/Cloudsway proxies.
 */
(function () {
  'use strict';

  var MC_FORUM_LS = 'mcurator_forum_runtime_v1';

  function uid(p) {
    return (p || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  /** Reconstruct display abstract from OpenAlex `abstract_inverted_index` */
  function openAlexInvAbstractToString_(inv) {
    if (!inv || typeof inv !== 'object') return '';
    var pos = [];
    for (var word in inv) {
      (inv[word] || []).forEach(function (n) {
        if (pos[n] === undefined) pos[n] = word;
      });
    }
    if (!pos.length) return '';
    return pos.join(' ').replace(/\s+/g, ' ').trim();
  }

  /** --- External service layer (swappable) --- */
  window.MCF_PapersService = {
    searchPubMed: function (query, retmax) {
      retmax = retmax || 8;
      var q = encodeURIComponent(query || 'biodiversity taxonomy');
      var url =
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=' +
        retmax +
        '&term=' +
        q;
      return fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var ids = (((j || {}).esearchresult || {}).idlist || []).slice(0, retmax);
          if (!ids.length) return MCF_PapersService._mockPapers(query);
          var sumUrl =
            'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=' +
            ids.join(',');
          return fetch(sumUrl).then(function (r2) {
            return r2.json();
          });
        })
        .then(function (sum) {
          var out = [];
          var res = (sum && sum.result) || {};
          var uids = res.uid || [];
          uids.forEach(function (id) {
            var x = res[id];
            if (!x) return;
            var authors = (x.authors || []).map(function (a) {
              return a.name;
            });
            out.push({
              source: 'pubmed',
              sourceId: String(id),
              title: x.title || '',
              journal: x.fulljournalname || x.source || '',
              pubdate: x.pubdate || x.epubdate || '',
              authors: authors,
              doi: x.elocationid || '',
              url: 'https://pubmed.ncbi.nlm.nih.gov/' + encodeURIComponent(id) + '/',
              abstract: ''
            });
          });
          return out;
        })
        .catch(function () {
          return MCF_PapersService._mockPapers(query);
        });
    },
    searchEuropePMC: function (query, pageSize) {
      pageSize = pageSize || 8;
      var q = encodeURIComponent(query || 'biodiversity');
      var url =
        'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' +
        q +
        '&format=json&pageSize=' +
        pageSize +
        '&resultType=core';
      return fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var hit = ((j || {}).resultList || {}).result || [];
          return hit.map(function (h) {
            return {
              source: 'europepmc',
              sourceId: h.id || h.pmid || '',
              title: h.title || '',
              journal: h.journalTitle || h.bookOrReportDetails || '',
              pubdate: h.firstPublicationDate || '',
              authors: (h.authorString || '').split(',').map(function (s) {
                return s.trim();
              }),
              doi: h.doi || '',
              url: h.fullTextUrlList && h.fullTextUrlList.fullTextUrl && h.fullTextUrlList.fullTextUrl[0] ? h.fullTextUrlList.fullTextUrl[0].url : 'https://europepmc.org/article/MED/' + encodeURIComponent(h.pmid || h.id || ''),
              abstract: h.abstractText || ''
            };
          });
        })
        .catch(function () {
          return MCF_PapersService._mockPapers(query);
        });
    },
    searchCrossref: function (query, rows) {
      rows = rows || 8;
      var q = encodeURIComponent(query || 'biodiversity specimen');
      var url = 'https://api.crossref.org/works?rows=' + rows + '&query=' + q;
      return fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var items = (((j || {}).message || {}).items) || [];
          return items.map(function (it) {
            var title = (it.title && it.title[0]) || '';
            var authorList = (it.author || []).map(function (a) {
              return (a.family || '') + (a.given ? ', ' + a.given : '');
            });
            return {
              source: 'crossref',
              sourceId: it.DOI || uid('doi'),
              title: title,
              journal: it['container-title'] && it['container-title'][0] ? it['container-title'][0] : '',
              pubdate: (it.published && it.published['date-parts'] && it.published['date-parts'][0] && it.published['date-parts'][0].join('-')) || '',
              authors: authorList,
              doi: it.DOI || '',
              url: it.URL || (it.DOI ? 'https://doi.org/' + it.DOI : ''),
              abstract: ''
            };
          });
        })
        .catch(function () {
          return MCF_PapersService._mockPapers(query);
        });
    },
    searchSemanticScholar: function (query, limit) {
      limit = limit || 5;
      var q = encodeURIComponent(query || 'biodiversity');
      var url =
        'https://api.semanticscholar.org/graph/v1/paper/search?query=' +
        q +
        '&limit=' +
        limit +
        '&fields=title,year,venue,url,abstract,authors,externalIds';
      return fetch(url, { method: 'GET' })
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var rows = (j && j.data) || [];
          return rows.map(function (p) {
            var al = ((p.authors || []).slice(0, 3).map(function (a) {
              return (a && a.name) || '';
            }) || []).filter(Boolean);
            var pm = p.externalIds && p.externalIds.PubMed;
            return {
              source: 's2',
              sourceId: (p.externalIds && (p.externalIds.DOI || p.externalIds.PubMed)) || p.paperId || '',
              title: p.title || '',
              journal: p.venue || 'Semantic Scholar',
              pubdate: p.year != null ? String(p.year) : '',
              authors: al,
              doi: (p.externalIds && p.externalIds.DOI) || '',
              url: p.url || (pm ? 'https://pubmed.ncbi.nlm.nih.gov/' + encodeURIComponent(pm) : ''),
              abstract: (p.abstract && String(p.abstract).slice(0, 400)) || ''
            };
          });
        })
        .catch(function () {
          return [];
        });
    },
    /**
     * OpenAlex (open, no key) — broad science index; natural-science and bio works.
     * @see https://docs.openalex.org
     */
    searchOpenAlex: function (query, perPage) {
      perPage = perPage || 3;
      var q = encodeURIComponent(
        (query && String(query).trim()) || 'biodiversity OR ecology OR taxonomy'
      );
      var url = 'https://api.openalex.org/works?search=' + q + '&per_page=' + perPage;
      return fetch(url, { method: 'GET' })
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var rows = (j && j.results) || [];
          return rows.map(function (w) {
            var pl = w.primary_location || {};
            var src = pl.source || {};
            var authors = (w.authorships || [])
              .map(function (a) {
                return a && a.author && a.author.display_name;
              })
              .filter(Boolean)
              .slice(0, 4);
            var d = w.doi ? String(w.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, '') : '';
            var openUrl =
              pl.landing_page_url || (d ? 'https://doi.org/' + encodeURIComponent(d) : '') || w.id || '';
            return {
              source: 'openalex',
              sourceId: String(d || w.id || uid('oax')),
              title: w.display_name || '',
              journal: (src && src.display_name) || (pl && pl.name) || 'OpenAlex',
              pubdate: w.publication_year != null ? String(w.publication_year) : '',
              authors: authors,
              doi: d,
              url: openUrl,
              abstract: (openAlexInvAbstractToString_(w.abstract_inverted_index) || '').slice(0, 500)
            };
          });
        })
        .catch(function () {
          return [];
        });
    },
    /**
     * Zenodo REST (open) — open data, ecology & specimen-related uploads.
     * @see https://zenodo.org/developers/
     */
    searchZenodo: function (query, size) {
      size = size || 3;
      var q = encodeURIComponent((query && String(query).trim()) || 'biodiversity');
      return fetch('https://zenodo.org/api/records?size=' + size + '&sort=mostrecent&q=' + q, {
        method: 'GET'
      })
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var hits = (j && j.hits && j.hits.hits) || [];
          return hits.map(function (h) {
            var m = h.metadata || {};
            var title = m.title;
            if (Array.isArray(title)) title = title[0] || '';
            if (title == null) title = 'Zenodo';
            var jt = m.journal && m.journal.title;
            return {
              source: 'zenodo',
              sourceId: String(h.id != null ? h.id : uid('z')),
              title: String(title).trim() || 'Zenodo',
              journal: jt ? String(jt) : (m.imprint_publisher && String(m.imprint_publisher)) || 'Zenodo',
              pubdate: (m.publication_date && String(m.publication_date).slice(0, 10)) || '',
              authors: (m.creators || [])
                .map(function (c) {
                  if (c.name != null) return String(c.name);
                  return [c.givenName || c.given, c.familyName || c.family]
                    .filter(function (s) { return s; })
                    .map(function (s) { return String(s); })
                    .join(' ');
                })
                .filter(Boolean)
                .slice(0, 3),
              doi: (m.doi && String(m.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')) || '',
              url: (h.links && h.links.html) || (m.doi ? 'https://doi.org/' + m.doi : 'https://zenodo.org/record/' + h.id),
              abstract: m.description
                ? String(m.description)
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 400)
                : ''
            };
          });
        })
        .catch(function () {
          return [];
        });
    },
    /**
     * arXiv preprints: q-bio* / physics.bio-ph* / q-fin.PM (CORS per browser; [] on error).
     * @see https://info.arxiv.org/help/api/user-manual.html
     */
    searchArxivQbio: function (query, max) {
      max = max || 2;
      var t = (query && String(query).trim()) || 'biodiversity';
      var tClean = t.replace(/[^\w\s\-\u4e00-\u9fff]/g, ' ').replace(/\s+/g, ' ').trim() || 'biodiversity';
      var parts = tClean.split(/\s+/).slice(0, 4);
      var andq = parts.map(function (p) { return 'all:"' + p + '"'; }).join('+AND+');
      var cat = '(cat:q-bio*+OR+cat:physics.bio-ph*+OR+cat:q-fin.PM*)';
      var searchQuery = andq + '+AND+' + cat;
      var url = 'https://export.arxiv.org/api/query?search_query=' + encodeURIComponent(searchQuery) + '&start=0&max_results=' + max;
      return fetch(url, { method: 'GET' })
        .then(function (r) {
          return r.text();
        })
        .then(function (text) {
          if (typeof DOMParser === 'undefined') return [];
          var doc = new DOMParser().parseFromString(text, 'text/xml');
          var getChildText = function (el, name) {
            if (!el) return '';
            var c = el.getElementsByTagNameNS('http://www.w3.org/2005/Atom', name);
            if (!c.length) c = el.getElementsByTagName(name);
            if (!c.length) return '';
            return (c[0] && c[0].textContent) || '';
          };
          var entries = doc.getElementsByTagNameNS('http://www.w3.org/2005/Atom', 'entry');
          if (!entries || !entries.length) entries = doc.getElementsByTagName('entry');
          var out = [];
          for (var i = 0; i < (entries && entries.length); i++) {
            var e = entries[i];
            if (!e) break;
            var title = (getChildText(e, 'title') || '')
              .replace(/^\s*|\s*$/g, '')
              .replace(/\n/g, ' ')
              .replace(/\s+/g, ' ');
            var idU = (getChildText(e, 'id') || '').replace(/\n/g, '').replace(/\s+/g, ' ').trim();
            var published = (getChildText(e, 'published') || getChildText(e, 'updated') || '').replace(/\n/g, '').trim();
            var sum = (getChildText(e, 'summary') || '')
              .replace(/^\s*|\s*$/g, '')
              .replace(/\n/g, ' ')
              .replace(/\s+/g, ' ');
            if (!title) continue;
            out.push({
              source: 'arxiv',
              sourceId: idU,
              title: title,
              journal: 'arXiv (life science / q-bio)',
              pubdate: published.slice(0, 10),
              authors: [],
              doi: '',
              url: idU,
              abstract: sum.slice(0, 450)
            });
          }
          return out;
        })
        .catch(function () {
          return [];
        });
    },
    searchOrcidPeople: function (query, rows) {
      rows = rows || 4;
      var q = encodeURIComponent(query || 'biodiversity museum');
      var url = 'https://pub.orcid.org/v3.0/expanded-search/?q=' + q + '&rows=' + rows;
      return fetch(url, { headers: { Accept: 'application/json' } })
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var list = (j && (j['expanded-result'] || j['expanded_result'])) || [];
          return list.map(function (x) {
            var oid = x['orcid-id'] || x['orcid_id'] || x.orcid || '';
            var nm =
              (typeof x['credit-name'] === 'string' && x['credit-name']) ||
              (x['credit-name'] && (x['credit-name'].name || [x['credit-name']['given-names'], x['credit-name']['family-name']].filter(Boolean).join(' '))) ||
              (x['given-names'] && (x['given-names'] + ' ' + (x['family-name'] || '')).trim()) ||
              'ORCID profile';
            return {
              source: 'orcid',
              sourceId: String(oid),
              title: nm,
              journal: 'ORCID',
              pubdate: '',
              authors: [],
              doi: '',
              url: 'https://orcid.org/' + String(oid).replace(/^https?:\/\/(www\.)?orcid.org\//, ''),
              abstract: (x['institution-name-1'] || x['affiliation'] || x['email'] || '').toString()
            };
          });
        })
        .catch(function () {
          return [];
        });
    },
    searchElicitProxy: function (query) {
      var base = (window.MC_LITERATURE_API && window.MC_LITERATURE_API.elicit) || '';
      if (!base) return Promise.resolve([]);
      return fetch(
        base + (base.indexOf('?') > -1 ? '&' : '?') + 'q=' + encodeURIComponent(query || 'biology'),
        {
          method: 'GET',
          headers: window.MC_LITERATURE_API && window.MC_LITERATURE_API.elicitKey
            ? { Authorization: 'Bearer ' + String(window.MC_LITERATURE_API.elicitKey) }
            : {}
        }
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var arr = Array.isArray(j) ? j : j && j.results;
          if (!Array.isArray(arr)) return [];
          return arr.map(function (x) {
            return {
              source: 'elicit',
              sourceId: x.id || uid('elicit'),
              title: x.title || 'Elicit result',
              journal: 'Elicit (proxy)',
              pubdate: (x.year || x.date || '') + '',
              authors: (x.authors && x.authors.slice(0, 2)) || [],
              doi: x.doi || '',
              url: x.url || 'https://elicit.org',
              abstract: (x.summary || x.abstract || '').slice(0, 500)
            };
          });
        })
        .catch(function () {
          return [];
        });
    },
    searchCloudsway: function (query) {
      var base = (window.MC_LITERATURE_API && window.MC_LITERATURE_API.cloudsway) || '';
      if (!base) return Promise.resolve([]);
      return fetch(
        base + (base.indexOf('?') > -1 ? '&' : '?') + 'q=' + encodeURIComponent(query || 'scholarly'),
        {
          method: 'GET',
          headers: window.MC_LITERATURE_API && window.MC_LITERATURE_API.cloudswayKey
            ? { 'X-API-Key': String(window.MC_LITERATURE_API.cloudswayKey) }
            : {}
        }
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var arr = Array.isArray(j) ? j : (j && j.items) || j && j.data;
          if (!Array.isArray(arr)) return [];
          return arr.map(function (x) {
            return {
              source: 'cloudsway',
              sourceId: x.id || uid('csw'),
              title: x.title || 'Cloudsway',
              journal: (x.venue != null && String(x.venue)) || (x.journal != null && String(x.journal)) || 'Cloudsway',
              pubdate: (x.year || '') + '',
              authors: (x.authors && x.authors.map(function (a) { return a.name || a; })) || [],
              doi: x.doi || '',
              url: x.url || 'https://cloudsway.com',
              abstract: (x.abstract || '').slice(0, 400)
            };
          });
        })
        .catch(function () {
          return [];
        });
    },
    searchScholarlyBundle: function (query) {
      var q = query || 'biodiversity museum taxonomy';
      return Promise.all([
        MCF_PapersService.searchPubMed(q, 3),
        MCF_PapersService.searchSemanticScholar(q, 2),
        MCF_PapersService.searchEuropePMC(q, 2),
        MCF_PapersService.searchCrossref(q, 2),
        MCF_PapersService.searchOpenAlex(q, 2),
        MCF_PapersService.searchZenodo(q, 2),
        MCF_PapersService.searchArxivQbio(q, 2),
        MCF_PapersService.searchOrcidPeople(q, 2),
        MCF_PapersService.searchElicitProxy(q),
        MCF_PapersService.searchCloudsway(q)
      ]).then(function (parts) {
        var out = [];
        parts.forEach(function (chunk) {
          if (Array.isArray(chunk)) out = out.concat(chunk);
        });
        return out;
      });
    },
    _mockPapers: function (query) {
      return [
        {
          source: 'pubmed',
          sourceId: '38400000',
          title: 'Amphibian biodiversity monitoring — demo result for “' + (query || '').slice(0, 24) + '”',
          journal: 'Conserv Biol Demo',
          pubdate: '2025',
          authors: ['Demo Author', 'Co Author'],
          doi: '10.0000/demo.2026',
          url: 'https://pubmed.ncbi.nlm.nih.gov/',
          abstract: 'Mock abstract (network or CORS blocked).'
        }
      ];
    }
  };

  window.MCF_NewsService = {
    searchGdelt: function (query, max) {
      max = max || 8;
      var q = encodeURIComponent(query || 'biodiversity conservation species');
      var url =
        'https://api.gdeltproject.org/api/v2/doc/doc?query=' +
        q +
        '&mode=artlist&maxrecords=' +
        max +
        '&format=json';
      return fetch(url)
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var arts = (j && j.articles) || [];
          return arts.map(function (a) {
            return {
              source: 'gdelt',
              sourceId: a.url || uid('gdelt'),
              title: a.title || '',
              domain: a.domain || '',
              seendate: a.seendate || '',
              url: a.url || '',
              summary: (a.excerpt || '').slice(0, 280)
            };
          });
        })
        .catch(function () {
          return MCF_NewsService._mockNews(query);
        });
    },
    _mockNews: function (query) {
      return [
        {
          source: 'gdelt',
          sourceId: 'mock_news_1',
          title: 'Species discovery reported — demo for “' + (query || 'biology').slice(0, 20) + '”',
          domain: 'news.example.org',
          seendate: nowIso().slice(0, 10),
          url: 'https://example.org/news/demo',
          summary: 'Mock GDELT row (API unreachable or blocked).'
        }
      ];
    }
  };

  window.MCF_ModerationService = {
    scoreContent: function (text) {
      var s = String(text || '');
      var reasons = [];
      var score = 0;
      var linkCount = (s.match(/https?:\/\/|www\./gi) || []).length;
      if (linkCount > 4) {
        score += 35;
        reasons.push('many_links');
      }
      var spamWords = /crypto|casino|telegram\.me|t\.me\/|line\.me|whatsapp|買幣|投資群|加賴|賴群/i;
      if (spamWords.test(s)) {
        score += 50;
        reasons.push('spam_keywords');
      }
      if (s.length > 20 && /^(.+)\1{3,}/.test(s.replace(/\s/g, ''))) {
        score += 30;
        reasons.push('repeated_pattern');
      }
      return { score: Math.min(100, score), reasons: reasons, flag: score >= 45 };
    },
    rateCheck: function (state, kind) {
      var u = state.forumUserStates.find(function (x) {
        return x.userId === state.forumSession.userId;
      });
      if (!u) return { ok: true };
      var now = Date.now();
      if (u.muteUntil && new Date(u.muteUntil).getTime() > now) return { ok: false, reason: 'muted' };
      if (u.suspensionUntil && new Date(u.suspensionUntil).getTime() > now) return { ok: false, reason: 'suspended' };
      if (u.banned) return { ok: false, reason: 'banned' };
      var cool = kind === 'post' ? (u.trustLevel >= 2 ? 15000 : 60000) : 8000;
      var last = kind === 'post' ? u.lastPostAt : u.lastCommentAt;
      if (last && now - new Date(last).getTime() < cool) return { ok: false, reason: 'rate' };
      return { ok: true };
    }
  };

  /** --- Default categories --- */
  function defaultCategories() {
    return [
      { id: 'all', slug: 'all', name: 'All', description: 'All discussions', icon: '🌐', colorToken: 'neutral', isSystem: true, sortOrder: 0 },
      { id: 'ann', slug: 'announcements', name: 'Announcements', description: 'Official', icon: '📣', colorToken: 'brand', isSystem: true, sortOrder: 1 },
      { id: 'field', slug: 'field-notes', name: 'Field Notes', description: 'Collection notes', icon: '📍', colorToken: 'teal', isSystem: false, sortOrder: 2 },
      { id: 'tax', slug: 'taxonomy-help', name: 'Taxonomy ID Help', description: 'IDs & keys', icon: '🔬', colorToken: 'blue', isSystem: false, sortOrder: 3 },
      { id: 'prep', slug: 'specimen-prep', name: 'Specimen Preparation', description: 'Prep & preservation', icon: '🧪', colorToken: 'slate', isSystem: false, sortOrder: 4 },
      { id: 'scholar', slug: 'literature-hub', name: 'Literature hub', description: 'Multi-source: PubMed, S2, OpenAlex, Zenodo, arXiv q-bio, ORCID, Europe PMC, Crossref', icon: '🔗', colorToken: 'indigo', isSystem: false, sortOrder: 5 },
      { id: 'papers', slug: 'research-papers', name: 'Research / Papers', description: 'Literature', icon: '📄', colorToken: 'violet', isSystem: false, sortOrder: 6 },
      { id: 'news', slug: 'biology-news', name: 'Biology News', description: 'Current events', icon: '📰', colorToken: 'amber', isSystem: false, sortOrder: 7 },
      { id: 'trade', slug: 'marketplace', name: 'Marketplace / Trading', description: 'Trading — moderated', icon: '💱', colorToken: 'orange', isSystem: false, sortOrder: 8 },
      { id: 'rules', slug: 'rules', name: 'Rules / Moderation', description: 'Policies', icon: '⚖️', colorToken: 'gray', isSystem: true, sortOrder: 9 }
    ];
  }

  function mergeForumCategories(cats) {
    var out = Array.isArray(cats) && cats.length ? cats.slice() : defaultCategories();
    if (out.some(function (c) { return c && c.id === 'scholar'; })) {
      return out.sort(function (a, b) { return (a.sortOrder | 0) - (b.sortOrder | 0); });
    }
    out.forEach(function (c) {
      if (c && (c.sortOrder | 0) >= 5) c.sortOrder = (c.sortOrder | 0) + 1;
    });
    out.push({
      id: 'scholar',
      slug: 'literature-hub',
      name: 'Literature hub',
      description: 'Multi-source: PubMed, S2, OpenAlex, Zenodo, arXiv (q-bio), ORCID, Europe PMC, Crossref; optional Elicit/Cloudsway via proxy',
      icon: '🔗',
      colorToken: 'indigo',
      isSystem: false,
      sortOrder: 5
    });
    return out.sort(function (a, b) { return (a.sortOrder | 0) - (b.sortOrder | 0); });
  }

  function defaultForumSeed() {
    var t = nowIso();
    return {
      forumCategories: defaultCategories(),
      forumPosts: [],
      forumComments: [],
      forumModerationQueue: [],
      forumModLog: [],
      forumUserStates: [
        { userId: 'u_guest', canPost: true, canComment: true, canVote: true, muteUntil: null, suspensionUntil: null, strikeCount: 0, trustLevel: 0, adRiskScore: 0, role: 'member', banned: false, lastPostAt: null, lastCommentAt: null },
        { userId: 'u_muted', canPost: false, canComment: false, canVote: true, muteUntil: new Date(Date.now() + 864e5 * 2).toISOString(), suspensionUntil: null, strikeCount: 1, trustLevel: 0, adRiskScore: 10, role: 'member', banned: false, lastPostAt: t, lastCommentAt: t },
        { userId: 'u_suspended', canPost: false, canComment: false, canVote: false, muteUntil: null, suspensionUntil: new Date(Date.now() + 864e5 * 7).toISOString(), strikeCount: 3, trustLevel: 0, adRiskScore: 20, role: 'member', banned: false, lastPostAt: t, lastCommentAt: t },
        { userId: 'u_mod', canPost: true, canComment: true, canVote: true, muteUntil: null, suspensionUntil: null, strikeCount: 0, trustLevel: 4, adRiskScore: 0, role: 'moderator', banned: false, lastPostAt: t, lastCommentAt: t }
      ],
      forumSession: { userId: 'u_guest', displayName: 'Guest Curator', role: 'moderator' }
    };
  }

  function migrateLegacyPosts(state) {
    var legacy = state.communityPosts || [];
    if (!state.forumPosts) state.forumPosts = [];
    if (state.forumPosts.length || !legacy.length) return;
    var t = nowIso();
    legacy.forEach(function (p) {
      state.forumPosts.push({
        id: p.id || uid('fp'),
        categoryId: 'field',
        postType: 'discussion',
        title: p.title || 'Untitled',
        body: p.body || '',
        authorId: 'legacy',
        authorName: p.author || 'Member',
        createdAt: t,
        updatedAt: t,
        score: 1,
        upvotes: 1,
        downvotes: 0,
        commentsCount: 0,
        tags: [p.tag || 'Discussion'],
        thumbnailUrl: '',
        externalUrl: '',
        sourceType: 'manual',
        sourceId: '',
        isPinned: false,
        isLocked: false,
        isHidden: false,
        isAdFlagged: false,
        moderationStatus: 'published',
        solvedAnswerId: null,
        views: 12,
        saveCount: 0,
        paperMeta: null,
        newsMeta: null
      });
    });
  }

  function buildDemoPosts() {
    var t = nowIso();
    return [
      { id: 'fp_pinned', categoryId: 'ann', postType: 'announcement', title: 'Welcome to MCurator Forum — read before posting', body: 'Professional discussion for specimen science. No unsolicited ads. Trading posts are heavily moderated.', authorId: 'u_mod', authorName: 'MCurator Mod', createdAt: t, updatedAt: t, score: 99, upvotes: 40, downvotes: 0, commentsCount: 2, tags: ['pinned', 'rules'], sourceType: 'manual', isPinned: true, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 1200, saveCount: 40, paperMeta: null, newsMeta: null },
      { id: 'fp_locked', categoryId: 'rules', postType: 'announcement', title: 'Anti-advertising & spam policy (locked)', body: 'Automated scoring flags excessive links and contact farming. Moderators may remove or suspend.', authorId: 'u_mod', authorName: 'MCurator Mod', createdAt: t, updatedAt: t, score: 55, upvotes: 20, downvotes: 0, commentsCount: 0, tags: ['policy'], sourceType: 'manual', isPinned: false, isLocked: true, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 400, saveCount: 10, paperMeta: null, newsMeta: null },
      { id: 'fp_beetle', categoryId: 'tax', postType: 'question', title: 'Need help identifying this beetle specimen from Nantou', body: 'Collected leaf litter sample. Elytra length ~8mm. Photos in thread — looking for tribe-level pointers.', authorId: 'u_guest', authorName: 'Field Researcher', createdAt: t, updatedAt: t, score: 24, upvotes: 18, downvotes: 0, commentsCount: 3, tags: ['Coleoptera', 'Taiwan'], sourceType: 'manual', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 210, saveCount: 5, paperMeta: null, newsMeta: null },
      { id: 'fp_moth_q', categoryId: 'tax', postType: 'question', title: 'Unanswered demo: micro-moth from light trap (needs genus)', body: 'Forewing length ~4mm; no dissection yet. Seeking tribe-level hints before slide prep.', authorId: 'u_guest', authorName: 'Night Survey', createdAt: t, updatedAt: t, score: 3, upvotes: 2, downvotes: 0, commentsCount: 0, tags: ['Lepidoptera', 'light trap'], sourceType: 'manual', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 42, saveCount: 1, paperMeta: null, newsMeta: null },
      { id: 'fp_field', categoryId: 'field', postType: 'showcase', title: 'Field collection notes: humidity effects on specimen preservation', body: 'Short protocol comparing silica vs ethanol for overnight storage in 85% RH.', authorId: 'u_guest', authorName: 'Lin · Field Lab', createdAt: t, updatedAt: t, score: 31, upvotes: 22, downvotes: 1, commentsCount: 1, tags: ['fieldwork', 'preservation'], sourceType: 'manual', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 180, saveCount: 8, paperMeta: null, newsMeta: null },
      { id: 'fp_scholar', categoryId: 'scholar', postType: 'paper', title: 'Literature hub: PubMed, OpenAlex, Zenodo, arXiv q-bio, ORCID & more', body: 'Use the literature rail and “Multi-source search” to query PubMed, Europe PMC, Crossref, Semantic Scholar, OpenAlex, Zenodo, arXiv q-bio, and ORCID. All free. Optional: window.MC_LITERATURE_API for Elicit/Cloudsway through your own proxy.', authorId: 'u_mod', authorName: 'MCurator Mod', createdAt: t, updatedAt: t, score: 36, upvotes: 24, downvotes: 0, commentsCount: 0, tags: ['OpenAlex', 'PubMed', 'S2', 'arXiv', 'Zenodo', 'E-utilities'], sourceType: 'manual', sourceId: '', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 220, saveCount: 6, paperMeta: null, newsMeta: null },
      { id: 'fp_pubmed', categoryId: 'papers', postType: 'paper', title: 'New PubMed: amphibian biodiversity monitoring methods', body: 'Imported abstract for discussion — methods applicable to our herp surveys.', authorId: 'u_guest', authorName: 'Literature Bot', createdAt: t, updatedAt: t, score: 42, upvotes: 30, downvotes: 0, commentsCount: 1, tags: ['PubMed', 'methods'], sourceType: 'pubmed', sourceId: '38400001', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 340, saveCount: 12, paperMeta: { journal: 'Methods Ecol Evol', pubdate: '2024', url: 'https://pubmed.ncbi.nlm.nih.gov/' }, newsMeta: null },
      { id: 'fp_news', categoryId: 'news', postType: 'news', title: 'Biology news: newly described species — discussion thread', body: 'GDELT-sourced headline attached; discuss provenance and museum implications.', authorId: 'u_guest', authorName: 'News Desk', createdAt: t, updatedAt: t, score: 18, upvotes: 12, downvotes: 0, commentsCount: 0, tags: ['species', 'news'], sourceType: 'gdelt', sourceId: 'gdelt_demo_1', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 95, saveCount: 3, paperMeta: null, newsMeta: { domain: 'science.example', url: 'https://example.org', summary: '…' } },
      { id: 'fp_herbarium', categoryId: 'prep', postType: 'discussion', title: 'Best practices for herbarium sheet photography', body: 'Lighting, color reference card, and DPI for OCR of labels.', authorId: 'u_guest', authorName: 'Herbarium Tech', createdAt: t, updatedAt: t, score: 27, upvotes: 19, downvotes: 0, commentsCount: 2, tags: ['imaging', 'herbarium'], sourceType: 'manual', isPinned: false, isLocked: false, isHidden: false, isAdFlagged: false, moderationStatus: 'published', views: 150, saveCount: 6, paperMeta: null, newsMeta: null },
      { id: 'fp_ad', categoryId: 'trade', postType: 'discussion', title: 'BUY CRYPTO SIGNALS + LINE ID: spam-demo', body: 'Contact me on WhatsApp for investment group!!! https://spam.example https://t.me/fake', authorId: 'u_muted', authorName: 'Bad Actor', createdAt: t, updatedAt: t, score: -5, upvotes: 0, downvotes: 12, commentsCount: 0, tags: [], sourceType: 'manual', isPinned: false, isLocked: false, isHidden: true, isAdFlagged: true, moderationStatus: 'pending_review', views: 5, saveCount: 0, paperMeta: null, newsMeta: null }
    ];
  }

  function buildDemoComments() {
    var t = nowIso();
    return [
      { id: 'fc1', postId: 'fp_beetle', parentId: null, body: 'Check Scarabaeidae vs Tenebrionidae — can you share dorsal shot?', authorId: 'u_mod', authorName: 'Taxonomy Helper', createdAt: t, score: 8, upvotes: 8, downvotes: 0, isHidden: false, moderationStatus: 'published' },
      { id: 'fc2', postId: 'fp_beetle', parentId: 'fc1', body: 'Seconded — also approximate GPS precision helps.', authorId: 'u_guest', authorName: 'Peer', createdAt: t, score: 3, upvotes: 3, downvotes: 0, isHidden: false, moderationStatus: 'published' },
      { id: 'fc3', postId: 'fp_pinned', parentId: null, body: 'Thanks — will keep posts on-topic.', authorId: 'u_guest', authorName: 'Guest Curator', createdAt: t, score: 5, upvotes: 5, downvotes: 0, isHidden: false, moderationStatus: 'published' }
    ];
  }

  function buildDemoQueue() {
    var t = nowIso();
    return [
      { id: 'fq1', targetType: 'post', targetId: 'fp_ad', reason: 'ad_flag_auto', status: 'pending', createdAt: t, score: 88 },
      { id: 'fq2', targetType: 'post', targetId: 'fp_beetle', reason: 'user_report', status: 'pending', createdAt: t, score: 0 }
    ];
  }

  function loadForumPersisted(state) {
    try {
      var raw = localStorage.getItem(MC_FORUM_LS);
      if (!raw) return false;
      var o = JSON.parse(raw);
      if (o.forumPosts && o.forumPosts.length) {
        state.forumCategories = mergeForumCategories(o.forumCategories || defaultCategories());
        state.forumPosts = o.forumPosts;
        state.forumComments = o.forumComments || [];
        state.forumModerationQueue = o.forumModerationQueue || [];
        state.forumModLog = o.forumModLog || [];
        state.forumUserStates = o.forumUserStates || defaultForumSeed().forumUserStates;
        state.forumSession = o.forumSession || defaultForumSeed().forumSession;
        return true;
      }
    } catch (e) {
      console.error('[MCurator] forum storage corrupt', e);
      try {
        localStorage.removeItem(MC_FORUM_LS);
      } catch (e2) {}
    }
    return false;
  }

  function saveForumPersisted(state) {
    try {
      localStorage.setItem(
        MC_FORUM_LS,
        JSON.stringify({
          forumCategories: state.forumCategories,
          forumPosts: state.forumPosts,
          forumComments: state.forumComments,
          forumModerationQueue: state.forumModerationQueue,
          forumModLog: state.forumModLog,
          forumUserStates: state.forumUserStates,
          forumSession: state.forumSession
        })
      );
    } catch (e) {}
  }

  function ensureForumState(state) {
    if (!state.forumCategories) state.forumCategories = defaultCategories();
    state.forumCategories = mergeForumCategories(state.forumCategories);
    if (!state.forumPosts) state.forumPosts = [];
    if (!state.forumComments) state.forumComments = [];
    if (!state.forumModerationQueue) state.forumModerationQueue = [];
    if (!state.forumModLog) state.forumModLog = [];
    if (!state.forumUserStates) state.forumUserStates = defaultForumSeed().forumUserStates;
    if (!state.forumSession) state.forumSession = defaultForumSeed().forumSession;
    if (!state.forumUi) {
      state.forumUi = { view: 'feed', postId: null, categoryId: 'all', sort: 'hot', typeFilter: 'all', search: '', modTab: 'pending' };
    }
    migrateLegacyPosts(state);
    if (!loadForumPersisted(state) && !state.forumPosts.length) {
      state.forumPosts = buildDemoPosts();
      state.forumComments = buildDemoComments();
      state.forumModerationQueue = buildDemoQueue();
      state.forumModLog = [
        { id: uid('log'), targetType: 'post', targetId: 'fp_ad', action: 'flag', reason: 'auto_ad', createdBy: 'system', createdAt: nowIso() }
      ];
      saveForumPersisted(state);
    } else if (!state.forumPosts.length) {
      state.forumPosts = buildDemoPosts();
      state.forumComments = buildDemoComments();
      state.forumModerationQueue = buildDemoQueue();
      saveForumPersisted(state);
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function forumSourceLabel(source) {
    var m = {
      pubmed: 'PubMed',
      s2: 'Semantic Scholar',
      europepmc: 'Europe PMC',
      crossref: 'Crossref',
      openalex: 'OpenAlex',
      zenodo: 'Zenodo',
      arxiv: 'arXiv (q-bio…)',
      orcid: 'ORCID',
      elicit: 'Elicit',
      cloudsway: 'Cloudsway'
    };
    return m[source] || String(source || '');
  }

  function catName(state, id) {
    var c = (state.forumCategories || []).find(function (x) {
      return x.id === id;
    });
    return c ? c.name : id;
  }

  function filterPosts(state) {
    var ui = state.forumUi || {};
    var list = (state.forumPosts || []).filter(function (p) {
      if (p.isHidden && !(state.forumSession && state.forumSession.role === 'moderator')) return false;
      if (ui.categoryId && ui.categoryId !== 'all' && p.categoryId !== ui.categoryId) return false;
      if (ui.typeFilter && ui.typeFilter !== 'all' && p.postType !== ui.typeFilter) return false;
      if (ui.search) {
        var q = ui.search.toLowerCase();
        if ((p.title + ' ' + p.body).toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });
    if (ui.sort === 'unanswered') {
      list = list.filter(function (p) {
        return p.postType === 'question' && (p.commentsCount | 0) === 0;
      });
    } else if (ui.sort === 'pinned') {
      list = list.filter(function (p) {
        return p.isPinned;
      });
    }
    if (ui.sort === 'new' || ui.sort === 'unanswered') {
      list.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (ui.sort === 'top' || ui.sort === 'pinned') {
      list.sort(function (a, b) {
        return (b.score || 0) - (a.score || 0);
      });
    } else {
      list.sort(function (a, b) {
        var ap = a.isPinned ? 1e9 : 0;
        var bp = b.isPinned ? 1e9 : 0;
        return bp + (b.score || 0) - (ap + (a.score || 0));
      });
    }
    return list;
  }

  function syncForumUiChips(state) {
    var ui = state.forumUi || {};
    document.querySelectorAll('[data-forum-sort]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-forum-sort') === (ui.sort || 'hot'));
    });
    document.querySelectorAll('[data-forum-cat]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-forum-cat') === (ui.categoryId || 'all'));
    });
    document.querySelectorAll('[data-forum-type]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-forum-type') === (ui.typeFilter || 'all'));
    });
  }

  function renderPostCard(state, p) {
    var badges =
      '<span class="forum-badge forum-badge--cat">' +
      esc(catName(state, p.categoryId)) +
      '</span> ' +
      '<span class="forum-badge forum-badge--type">' +
      esc(p.postType) +
      '</span>';
    if (p.isPinned) badges += ' <span class="forum-badge forum-badge--pin">Pinned</span>';
    if (p.isLocked) badges += ' <span class="forum-badge forum-badge--lock">Locked</span>';
    if (p.moderationStatus === 'pending_review') badges += ' <span class="forum-badge forum-badge--mod">Pending</span>';
    if (p.isAdFlagged) badges += ' <span class="forum-badge forum-badge--ad">Ad flag</span>';
    if (
      p.sourceType === 'pubmed' ||
      p.sourceType === 'europepmc' ||
      p.sourceType === 'crossref' ||
      p.sourceType === 's2' ||
      p.sourceType === 'orcid' ||
      p.sourceType === 'openalex' ||
      p.sourceType === 'zenodo' ||
      p.sourceType === 'arxiv'
    ) {
      badges += ' <span class="forum-badge forum-badge--src">Paper</span>';
    }
    if (p.sourceType === 'gdelt') badges += ' <span class="forum-badge forum-badge--src">News</span>';
    var prev = esc(String(p.body || '').replace(/\s+/g, ' ').slice(0, 220));
    return (
      '<article class="forum-post-card" data-post-id="' +
      esc(p.id) +
      '">' +
      '<div class="forum-post-card__vote" aria-hidden="true"><span class="forum-vote-score">' +
      (p.score | 0) +
      '</span></div>' +
      '<div class="forum-post-card__main">' +
      '<div class="forum-post-card__meta">' +
      badges +
      '<span class="forum-post-card__author">' +
      esc(p.authorName) +
      '</span>' +
      '<span class="forum-post-card__time"> · ' +
      esc(String(p.createdAt || '').slice(0, 10)) +
      '</span></div>' +
      '<h3 class="forum-post-card__title"><button type="button" class="btn-link forum-open-post" data-id="' +
      esc(p.id) +
      '">' +
      esc(p.title) +
      '</button></h3>' +
      '<p class="forum-post-card__excerpt">' +
      prev +
      (String(p.body || '').length > 220 ? '…' : '') +
      '</p>' +
      '<div class="forum-post-card__foot">' +
      '<span>💬 ' +
      (p.commentsCount | 0) +
      '</span>' +
      '<span> · 👁 ' +
      (p.views | 0) +
      '</span>' +
      '<span> · 🔖 ' +
      (p.saveCount | 0) +
      '</span>' +
      '</div></div></article>'
    );
  }

  function renderFeed(state) {
    var list = filterPosts(state);
    var inner = list.length ? list.map(function (p) {
      return renderPostCard(state, p);
    }).join('') : '<div class="mc-empty-state"><span class="mc-empty-state__glyph" aria-hidden="true">💬</span><div class="mc-empty-state__title">No threads match filters</div></div>';
    return inner;
  }

  function renderComments(state, postId) {
    var all = (state.forumComments || []).filter(function (c) {
      return c.postId === postId && !c.isHidden;
    });
    var roots = all.filter(function (c) {
      return !c.parentId;
    });
    function thread(c) {
      var kids = all.filter(function (x) {
        return x.parentId === c.id;
      });
      return (
        '<div class="forum-comment" id="fc-' +
        esc(c.id) +
        '">' +
        '<div class="forum-comment__head"><strong>' +
        esc(c.authorName) +
        '</strong> · ' +
        esc(String(c.createdAt || '').slice(0, 16)) +
        '</div>' +
        '<div class="forum-comment__body">' +
        esc(c.body) +
        '</div>' +
        (kids.length ? '<div class="forum-comment__kids">' + kids.map(thread).join('') + '</div>' : '') +
        '</div>'
      );
    }
    return roots.map(thread).join('') || '<p class="forum-muted">No comments yet.</p>';
  }

  function bindForumHandlers(state) {
    document.querySelectorAll('.forum-open-post').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        if (id) window.MCForum.openPost(id);
      });
    });
  }

  window.MCForum = {
    init: function (state) {
      window.__MC_APP_STATE__ = state;
      ensureForumState(state);
      saveForumPersisted(state);
    },
    render: function (state) {
      window.__MC_APP_STATE__ = state;
      ensureForumState(state);
      var feed = document.getElementById('forumFeed');
      var railPapers = document.getElementById('forumRailPapers');
      var railNews = document.getElementById('forumRailNews');
      if (feed) {
        feed.innerHTML = renderFeed(state);
        bindForumHandlers(state);
      }
      syncForumUiChips(state);
      var det = document.getElementById('forumDetailBody');
      if (det && state.forumUi && state.forumUi.view === 'detail' && state.forumUi.postId) {
        window.MCForum.renderDetail(state);
      }
      if (railPapers) {
        var isZh0 = window.__MC_APP_STATE__ && window.__MC_APP_STATE__.lang === 'zh-TW';
        railPapers.innerHTML =
          '<div class="forum-rail-item forum-muted">' +
          esc(isZh0 ? '載入文獻中…' : 'Loading literature…') +
          '</div>';
        MCF_PapersService.searchScholarlyBundle('biodiversity taxonomy museum specimen ORCID').then(function (rows) {
          var el2 = document.getElementById('forumRailPapers');
          if (!el2) return;
          var show = (rows || []).slice(0, 10);
          el2.innerHTML = show.length
            ? show
                .map(function (r) {
                  var titleStr = (r.title || '').slice(0, 70);
                  var sub = r.journal || (r.abstract ? String(r.abstract).slice(0, 72) : '') || '';
                  return (
                    '<div class="forum-rail-item"><span class="forum-badge forum-badge--type" style="font-size:10px;">' +
                    esc(forumSourceLabel(r.source)) +
                    '</span><br/><strong>' +
                    esc(titleStr) +
                    ((r.title || '').length > 70 ? '…' : '') +
                    '</strong><br/><span class="forum-muted">' +
                    esc(sub) +
                    ' · ' +
                    esc(r.pubdate || '') +
                    '</span><br/><a href="' +
                    esc(r.url) +
                    '" target="_blank" rel="noopener">' +
                    (isZh0 ? '開啟' : 'Open') +
                    '</a></div>'
                  );
                })
                .join('')
            : '<div class="forum-rail-item forum-muted">' + esc(isZh0 ? '找不到文獻或暫時無法載入。' : 'No results (sources blocked or query empty).') + '</div>';
        });
      }
      if (railNews) {
        railNews.innerHTML = '<div class="forum-rail-item forum-muted">Loading news…</div>';
        MCF_NewsService.searchGdelt('biodiversity conservation species discovery', 4).then(function (rows) {
          var el2 = document.getElementById('forumRailNews');
          if (!el2) return;
          el2.innerHTML = rows.length
            ? rows
                .map(function (r) {
                  return (
                    '<div class="forum-rail-item"><strong>' +
                    esc((r.title || '').slice(0, 80)) +
                    '</strong><br/><span class="forum-muted">' +
                    esc(r.domain || '') +
                    ' · ' +
                    esc(r.seendate || '') +
                    '</span><br/><a href="' +
                    esc(r.url) +
                    '" target="_blank" rel="noopener">Open</a></div>'
                  );
                })
                .join('')
            : '<div class="forum-rail-item forum-muted">No news items.</div>';
        });
      }
      window.MCForum.renderModQueue(state);
    },
    formatPostTime: function (iso) {
      var s = String(iso || '');
      if (!s) return '';
      var d = new Date(s);
      if (isNaN(d.getTime())) return s.slice(0, 16);
      var lang = (window.__MC_APP_STATE__ && window.__MC_APP_STATE__.lang) || 'zh-TW';
      try {
        return d.toLocaleString(
          lang === 'zh-TW' ? 'zh-TW' : lang === 'en' ? 'en' : (lang || 'en').split('-')[0] || 'en',
          { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
        );
      } catch (e) {
        return d.toLocaleString();
      }
    },
    t_: function (key) {
      try {
        if (window.MCt && typeof window.MCt === 'function') return window.MCt(key);
      } catch (e) {}
      if (key === 'forum_back_list') return 'Back to list';
      if (key === 'forum_reply_placeholder') return 'Reply…';
      if (key === 'forum_post_comment') return 'Post comment';
      if (key === 'forum_comments_h') return 'Comments';
      if (key === 'forum_aria_thread') return 'Thread';
      return key;
    },
    renderDetail: function (state) {
      var id = state.forumUi.postId;
      var p = (state.forumPosts || []).find(function (x) {
        return x.id === id;
      });
      var slot = document.getElementById('forumDetailBody');
      var panel = document.getElementById('forumPostDetail');
      var col = document.getElementById('forumCenterCol');
      if (!p || !slot || !panel) return;
      if (col) {
        col.classList.add('forum-center--thread-hidden');
      }
      panel.style.display = 'block';
      panel.classList.add('forum-post-detail--overlay');
      var metaTime = window.MCForum.formatPostTime(p.createdAt);
      var backLabel = '← ' + window.MCForum.t_('forum_back_list');
      slot.innerHTML =
        '<div class="forum-detail-head"><button type="button" class="secondary-btn" onclick="MCForum.backFeed()">' +
        esc(backLabel) +
        '</button></div>' +
        '<h2 class="forum-detail-title">' +
        esc(p.title) +
        '</h2>' +
        '<div class="forum-detail-meta">' +
        esc(p.authorName) +
        ' · ' +
        esc(metaTime) +
        '</div>' +
        '<div class="forum-detail-body">' +
        esc(p.body) +
        '</div>' +
        '<h4 class="forum-h4">' +
        esc(window.MCForum.t_('forum_comments_h')) +
        '</h4>' +
        '<div class="forum-comments">' +
        renderComments(state, p.id) +
        '</div>' +
        '<div class="forum-reply"><textarea class="textarea" id="forumReplyText" placeholder="' +
        esc(window.MCForum.t_('forum_reply_placeholder')) +
        '" rows="3"></textarea>' +
        '<button type="button" class="primary-btn" style="margin-top:8px" onclick="MCForum.submitComment()">' +
        esc(window.MCForum.t_('forum_post_comment')) +
        '</button></div>';
      try {
        panel.setAttribute('aria-label', window.MCForum.t_('forum_aria_thread'));
        panel.setAttribute('tabindex', '-1');
        panel.focus();
      } catch (e) {}
    },
    backFeed: function () {
      var state = window.__MC_APP_STATE__;
      if (!state || !state.forumUi) return;
      state.forumUi.view = 'feed';
      state.forumUi.postId = null;
      var panel = document.getElementById('forumPostDetail');
      var col = document.getElementById('forumCenterCol');
      if (panel) {
        panel.style.display = 'none';
        panel.classList.remove('forum-post-detail--overlay');
        panel.removeAttribute('tabindex');
      }
      if (col) col.classList.remove('forum-center--thread-hidden');
      window.MCForum.render(state);
    },
    openPost: function (id) {
      var state = window.__MC_APP_STATE__;
      if (!state) return;
      state.forumUi = state.forumUi || {};
      state.forumUi.view = 'detail';
      state.forumUi.postId = id;
      window.MCForum.renderDetail(state);
    },
    submitComment: function () {
      var state = window.__MC_APP_STATE__;
      var ta = document.getElementById('forumReplyText');
      if (!state || !ta) return;
      var body = String(ta.value || '').trim();
      if (!body) return;
      var chk = MCF_ModerationService.rateCheck(state, 'comment');
      if (!chk.ok) {
        alert('Cannot comment: ' + chk.reason);
        return;
      }
      var sc = MCF_ModerationService.scoreContent(body);
      var pid = state.forumUi.postId;
      var c = {
        id: uid('fc'),
        postId: pid,
        parentId: null,
        body: body,
        authorId: state.forumSession.userId,
        authorName: state.forumSession.displayName || 'User',
        createdAt: nowIso(),
        score: 1,
        upvotes: 1,
        downvotes: 0,
        isHidden: sc.flag,
        moderationStatus: sc.flag ? 'pending_review' : 'published'
      };
      state.forumComments.push(c);
      var post = state.forumPosts.find(function (x) {
        return x.id === pid;
      });
      if (post) post.commentsCount = (post.commentsCount || 0) + 1;
      var u = state.forumUserStates.find(function (x) {
        return x.userId === state.forumSession.userId;
      });
      if (u) u.lastCommentAt = nowIso();
      if (sc.flag) {
        state.forumModerationQueue.push({
          id: uid('fq'),
          targetType: 'comment',
          targetId: c.id,
          reason: 'spam_score',
          status: 'pending',
          createdAt: nowIso(),
          score: sc.score
        });
      }
      saveForumPersisted(state);
      ta.value = '';
      window.MCForum.renderDetail(state);
    },
    setSort: function (s) {
      var state = window.__MC_APP_STATE__;
      if (!state) return;
      state.forumUi.sort = s;
      document.querySelectorAll('[data-forum-sort]').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-forum-sort') === s);
      });
      window.MCForum.render(state);
    },
    setCategory: function (id) {
      var state = window.__MC_APP_STATE__;
      if (!state) return;
      state.forumUi.categoryId = id;
      document.querySelectorAll('[data-forum-cat]').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-forum-cat') === id);
      });
      window.MCForum.render(state);
    },
    setTypeFilter: function (t) {
      var state = window.__MC_APP_STATE__;
      if (!state) return;
      state.forumUi.typeFilter = t;
      document.querySelectorAll('[data-forum-type]').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-forum-type') === t);
      });
      window.MCForum.render(state);
    },
    search: function (v) {
      var state = window.__MC_APP_STATE__;
      if (!state) return;
      state.forumUi.search = v;
      window.MCForum.render(state);
    },
    openCreateModal: function () {
      var m = document.getElementById('forumCreateMask');
      if (m) {
        m.classList.add('show');
        m.style.display = 'flex';
      }
    },
    closeCreateModal: function () {
      var m = document.getElementById('forumCreateMask');
      if (m) {
        m.classList.remove('show');
        m.style.display = 'none';
      }
    },
    submitCreate: function () {
      var state = window.__MC_APP_STATE__;
      if (!state) return;
      var title = (document.getElementById('forumCreateTitle') && document.getElementById('forumCreateTitle').value) || '';
      var body = (document.getElementById('forumCreateBody') && document.getElementById('forumCreateBody').value) || '';
      var cat = (document.getElementById('forumCreateCategory') && document.getElementById('forumCreateCategory').value) || 'field';
      var ptype = (document.getElementById('forumCreateType') && document.getElementById('forumCreateType').value) || 'discussion';
      if (!String(title).trim()) return;
      var chk = MCF_ModerationService.rateCheck(state, 'post');
      if (!chk.ok) {
        alert('Cannot post: ' + chk.reason);
        return;
      }
      var sc = MCF_ModerationService.scoreContent(title + '\n' + body);
      var post = {
        id: uid('fp'),
        categoryId: cat,
        postType: ptype,
        title: title.trim(),
        body: body.trim(),
        authorId: state.forumSession.userId,
        authorName: state.forumSession.displayName || 'User',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        score: 1,
        upvotes: 1,
        downvotes: 0,
        commentsCount: 0,
        tags: [],
        sourceType: 'manual',
        isPinned: false,
        isLocked: false,
        isHidden: sc.flag,
        isAdFlagged: sc.flag,
        moderationStatus: sc.flag ? 'pending_review' : 'published',
        views: 0,
        saveCount: 0,
        paperMeta: null,
        newsMeta: null
      };
      state.forumPosts.unshift(post);
      if (sc.flag) {
        state.forumModerationQueue.push({
          id: uid('fq'),
          targetType: 'post',
          targetId: post.id,
          reason: 'spam_score',
          status: 'pending',
          createdAt: nowIso(),
          score: sc.score
        });
      }
      var u = state.forumUserStates.find(function (x) {
        return x.userId === state.forumSession.userId;
      });
      if (u) u.lastPostAt = nowIso();
      saveForumPersisted(state);
      window.MCForum.closeCreateModal();
      window.MCForum.render(state);
    },
    renderModQueue: function (state) {
      var el = document.getElementById('forumModQueueBody');
      if (!el) return;
      if (!(state.forumSession && state.forumSession.role === 'moderator')) {
        el.innerHTML = '';
        return;
      }
      var q = state.forumModerationQueue || [];
      el.innerHTML = q.length
        ? q
            .map(function (x) {
              return (
                '<div class="forum-mod-row">' +
                esc(x.targetType) +
                ' ' +
                esc(x.targetId) +
                ' — ' +
                esc(x.reason) +
                ' <button type="button" class="small-btn soft" onclick="MCForum.modApprove(\'' +
                esc(x.id) +
                "')\">Approve</button> <button type=\"button\" class=\"small-btn soft\" onclick=\"MCForum.modRemove('" +
                esc(x.id) +
                "')\">Remove</button></div>"
              );
            })
            .join('')
        : '<p class="forum-muted">Queue empty.</p>';
    },
    modApprove: function (qid) {
      var state = window.__MC_APP_STATE__;
      var x = (state.forumModerationQueue || []).find(function (q) {
        return q.id === qid;
      });
      if (!x) return;
      state.forumModerationQueue = state.forumModerationQueue.filter(function (q) {
        return q.id !== qid;
      });
      state.forumModLog.push({ id: uid('log'), targetType: x.targetType, targetId: x.targetId, action: 'approve', reason: '', createdBy: state.forumSession.userId, createdAt: nowIso() });
      saveForumPersisted(state);
      window.MCForum.render(state);
    },
    modRemove: function (qid) {
      var state = window.__MC_APP_STATE__;
      var x = (state.forumModerationQueue || []).find(function (q) {
        return q.id === qid;
      });
      if (!x) return;
      if (x.targetType === 'post') {
        var p = state.forumPosts.find(function (z) {
          return z.id === x.targetId;
        });
        if (p) {
          p.moderationStatus = 'removed';
          p.isHidden = true;
        }
      }
      state.forumModerationQueue = state.forumModerationQueue.filter(function (q) {
        return q.id !== qid;
      });
      saveForumPersisted(state);
      window.MCForum.render(state);
    },
    openLiteratureSearch: function () {
      var isZh = window.__MC_APP_STATE__ && window.__MC_APP_STATE__.lang === 'zh-TW';
      var defQ = isZh ? '生物多樣性 分類' : 'biodiversity taxonomy';
      var q = prompt(
        isZh
          ? '匯流文獻搜尋（PubMed、OpenAlex、Zenodo、arXiv q-bio、Semantic Scholar、ORCID 等，免費）'
          : 'Search literature (PubMed, OpenAlex, Zenodo, arXiv q-bio, S2, ORCID, etc.):',
        defQ
      );
      if (!q) return;
      MCF_PapersService.searchScholarlyBundle(q).then(function (rows) {
        if (!rows || !rows.length) {
          alert(isZh ? '沒有符合的結果' : 'No results');
          return;
        }
        var lines = rows.slice(0, 5).map(function (r) {
          return '[' + forumSourceLabel(r.source) + '] ' + (r.title || '').slice(0, 64);
        });
        alert((isZh ? '前幾筆：\n' : 'Top matches:\n') + lines.join('\n'));
      });
    },
    openPaperSearch: function () {
      var isZh = window.__MC_APP_STATE__ && window.__MC_APP_STATE__.lang === 'zh-TW';
      var q = prompt(isZh ? '搜尋 PubMed 論文：' : 'Search papers (PubMed):', isZh ? '生物多樣性' : 'biodiversity');
      if (!q) return;
      MCF_PapersService.searchPubMed(q).then(function (rows) {
        alert((isZh ? '首筆：' : 'Top result: ') + (rows[0] && rows[0].title ? rows[0].title : isZh ? '無' : 'none'));
      });
    },
    openNewsSearch: function () {
      var isZh = window.__MC_APP_STATE__ && window.__MC_APP_STATE__.lang === 'zh-TW';
      var q = prompt(isZh ? '搜尋 GDELT 新聞：' : 'Search GDELT news:', isZh ? '保育 物種' : 'conservation species');
      if (!q) return;
      MCF_NewsService.searchGdelt(q).then(function (rows) {
        alert((isZh ? '首筆：' : 'Top result: ') + (rows[0] && rows[0].title ? rows[0].title : isZh ? '無' : 'none'));
      });
    },
    openReportModal: function () {
      alert('Report recorded (demo). Use moderation queue as moderator.');
    }
  };
})();
