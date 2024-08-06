# Cloudflare v2ray worker
A unified method to use various configs of v2ray in a Cloudflare's worker.
Reads address, host, sni and config lists from Cloudflare's KV namespaces.

Set-up
------
Create a worker and add worker.js code to it. For `IP`, `HOST`, `SNI`, `SUBS` and `SUBS2` you can use direct variable hardcoded or you can use Cloudflare's KV namespace mechanism.

Variables to set
---------------------------------------
- `IP` is a Clouflare's clean ip or a domain bound to cl's clean ips.
- `HOST` is the link of you worker or a domain bound to the worker. The latter is better.
- `SNI` a random subdomain of your `HOST`.
- `SUBS` is a link to a subscription list. The worker load its content line by line as a configs sub.
- `SUBS2` is an alternative to `SUBS2`

usage
-----
Use `https://YOUR_WOKER_DOMAIN_OR_HOST_DOMAIN/subs` or alternative `https://YOUR_WOKER_DOMAIN_OR_HOST_DOMAIN/subs2` for subscription.
