export default {
  async fetch(request, env) {

    const IP = await env.V2RAY.get('ip');
    const HOST = await env.V2RAY.get('host');
    const SNI = await env.V2RAY.get('sni');
    const SUBS = await env.V2RAY.get('cfglist');
    const SUBS2 = await env.V2RAY.get('cfglist2');

    let url = new URL(request.url);
    
    let realhostname = url.pathname.split('/')[1];
    let realpathname = url.pathname.split('/')[2];

    if (url.pathname.startsWith('/subs')) {

      let list = ''

      if(url.pathname.startsWith('/subs2')){
        list = SUBS2;
      }else if(url.pathname.startsWith('/subs')){
        list = SUBS;
      }
      const subs = await fetch(list);
      const all_encoded_configs = await subs.text();

      let new_configs = '';
      for(let sub of all_encoded_configs.split('\n')){

        let subName = sub.split('/')[3]
        let sub_count = 1;

        const resp = await fetch(sub);
        const encoded_configs = await resp.text();

        let configs = '';
        if(encoded_configs.search('://') === -1){
          try {
            configs = atob(encoded_configs);
          } catch(err){
            console.log('atob error for all config: ', subName);
          }
        }

        let configsList = configs.split('\n');
        for (let config of configsList) {
          if (config.search('vmess') != -1) {
            config = config.replace('vmess://', '');
            try{
              config = atob(config);
            }catch(err){
              console.log('atob error for config: ', subName, sub_count-1, '-', sub_count);
              continue;
            }

            let config_parsed = JSON.parse(config);
            if (config_parsed.net == 'ws' && config_parsed.port == 443) {
              let new_config = {
                v: '2',
                ps: subName + '-' + sub_count,
                add: IP,
                port: config_parsed.port,
                id: config_parsed.id,
                net: config_parsed.net,
                host: HOST,
                path:config_parsed.host + config_parsed.path,
                tls: config_parsed.tls,
                sni: SNI,
                aid: '0',
                scy: 'auto',
                type: 'auto',
                fp: 'chrome',
                alpn: 'http/1.1'
              }

              let encodedConfig = 'vmess://' + btoa(JSON.stringify(new_config));
              console.log('conf: ', JSON.stringify(new_config))
              console.log('conf: ', encodedConfig)
              new_configs = new_configs  + encodedConfig+ '\n';
              sub_count += 1;
            }
          }
        }
      }
      console.log('all configs:', new_configs.split("\n").length);
      return new Response(new_configs);

    } else {

        const url = new URL(request.url);
        const splitted = url.pathname.replace(/^\/*/, '').split('/');
        //console.log(':::::::::', url.pathname, url.pathname.replace(/^\/*/, ''))
        const address = splitted[0];
        url.pathname = splitted.slice(1).join('/');
        url.hostname = address;
        url.protocol = 'https';
        return fetch(new Request(url, request));
    }
  },
};
