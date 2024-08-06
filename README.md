# Cloudflare v2ray worker
A unified method to use various configs of v2ray in a Cloudflare's worker.
Reads address, host, sni and config lists from Cloudflare's KV namespaces.

config
------
Create a worker and add worker.js code to it. For `IP`, `HOST`, `SNI`, SUBS and `SUBS2` you can use direct variable hardcoded or you can use Cloudflare's KV namespace mechanism.

config using direct hardcoded variables
---------------------------------------
`IP` is a Clouflare's clean ip or a domain bound to cl's clean ips.
`HOST` is the link of you worker or a domain bound to the worker. The latter is better.
`SUBS` is a link to a subscription list which each line is a config subs.
`SUBS2` is an alternative to `SUBS2`

config using Cloudlare's KV
---------------------------
In Cloudflare's dashboard in th left navigation go to `Workers and Pages` select `KV`. In the KV page click on `Create a namespace` and add a Namespace. The new Namespace will appear in the table in the bottom of the page. Find your namespace and click on its `View`.

