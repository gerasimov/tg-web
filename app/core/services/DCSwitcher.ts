let dcs: { [key: number]: { host: string; port: number } };

if (process.env.NODE_ENV === 'production') {
  dcs = {
    1: { host: '149.154.175.50', port: 443 },
    2: { host: '149.154.167.50', port: 443 },
    3: { host: '149.154.175.100', port: 443 },
    4: { host: '149.154.167.91', port: 443 },
    5: { host: '149.154.171.5', port: 443 },
  };
} else {
  dcs = {
    1: { host: '149.154.175.10', port: 443 },
    2: { host: '149.154.167.50', port: 80 },
    3: { host: '149.154.175.117', port: 443 },
  };
}

export class DCSwitcher {
  defaultDc = 2;

  dc = this.defaultDc;

  getUrl() {
    return dcs[this.dc];
  }
  
  getDc() {
    return this.dc;
  }

  getEndpoint() {
    return process.env.NODE_ENV === 'production' ? 'apiw1' : 'apiw_test1';
  }

  switch(dc: number) {
    this.dc = dc;
  }
}

const switcher = new DCSwitcher();
window.DCS = switcher;
export default switcher;
