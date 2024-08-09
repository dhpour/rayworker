export default {
  async fetch(request, env) {

    const IP = await env.V2RAY.get('ip');
    const HOST = await env.V2RAY.get('host');
    const SNI = await env.V2RAY.get('sni');

    const subs1 = [
      'https://raw.githubusercontent.com/Epodonios/v2ray-configs/main/Config list1.txt',
      'https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/Eternity',
      'https://raw.githubusercontent.com/AzadNetCH/Clash/main/AzadNet_iOS.txt'
    ];

    const subs2 = [
      'https://raw.githubusercontent.com/mahdibland/V2RayAggregator/master/sub/list/00.txt',
      'https://raw.githubusercontent.com/Leon406/SubCrawler/main/sub/share/all4',
      'https://raw.githubusercontent.com/mfuu/v2ray/master/clash.yaml',
      'https://raw.githubusercontent.com/peasoft/NoMoreWalls/master/list.yml',
      'https://raw.githubusercontent.com/a2470982985/getNode/main/clash.yaml',
      'https://raw.githubusercontent.com/mlabalabala/v2ray-node/main/nodefree4clash.txt',
      'https://raw.githubusercontent.com/mahdibland/V2RayAggregator/master/sub/sub_merge.txt',
      'https://raw.githubusercontent.com/mfuu/v2ray/master/v2ray'
    ];

    const subs3 = [
      'https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/sub/sub_merge.txt',
      'https://raw.fastgit.org/Pawdroid/Free-servers/main/sub',
      'https://raw.fastgit.org/freefq/free/master/v2',
      'https://raw.githubusercontent.com/awesome-vpn/awesome-vpn/master/all',
      'https://raw.githubusercontent.com/AzadNetCH/Clash/main/V2Ray.txt',
      'https://raw.githubusercontent.com/mianfeifq/share/main/data2023025.txt',
      'https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2',
      'https://raw.githubusercontent.com/barry-far/V2ray-Configs/main/Sub2.txt',
    ];

    let url = new URL(request.url);
    
    let realhostname = url.pathname.split('/')[1];
    let realpathname = url.pathname.split('/')[2];

    if (url.pathname.startsWith('/subs')) {

      let list = 'https://github.com/dhpour/rayworker/raw/main/subs';

      let subs = [];
      if(url.pathname.startsWith('/subs3')){
        subs = subs3;
      }
      else if(url.pathname.startsWith('/subs2')){
        subs = subs2;
      }else{
        subs = subs1;
      }

      //const subs = await fetch(list);
      //const all_encoded_configs = await subs.text();

      let new_configs = '';
      for(let sub of subs){//all_encoded_configs.split('\n')){

        let subName = sub.split('/')[3]
        let sub_count = 1;

        const resp = await fetch(sub);
        const encoded_configs = await resp.text();

        let configs = '';
        if(encoded_configs.search('://') === -1){
          try {
            configs = atob(encoded_configs);
          } catch(err){
            //console.log('atob error for all config: ', subName);
          }
        }

        let configsList = configs.split('\n');
        for (let config of configsList) {
          if (config.search('vmess') != -1) {
            config = config.replace('vmess://', '');
            try{
              config = atob(config);
            }catch(err){
              //console.log('atob error for config: ', subName, sub_count-1, '-', sub_count);
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
              //console.log('conf: ', JSON.stringify(new_config))
              //console.log('conf: ', encodedConfig)
              new_configs = new_configs  + encodedConfig+ '\n';
              sub_count += 1;
            }
          }
        }
      }
      //console.log('all configs:', new_configs.split("\n").length);
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
