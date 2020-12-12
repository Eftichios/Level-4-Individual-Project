import re

domains = []

with open("blocked.txt") as f:
    
    for domain in f.read().split("\n"):
        domains.append((domain.lstrip("||")).rstrip("^\n"))

domain_map = {}

for domain in domains:
    find_host = re.search('^(.+)\.',domain)
    if find_host:
        hostname = find_host.group(1)
    else:
        print(domain)
    if "Hostname" in domain or "from" in domain:
        continue
    parsed_domain = "*://*." + domain + "/*"
    domain_map[hostname] = domain_map.get(hostname, []) + [parsed_domain]

with open("blocked.js", "w") as f:
    f.write("var blocked_domains = {\n")
    for hostname, urls in domain_map.items():
        f.write("\"" + hostname + '"' ":" + '[' + str(urls)[1:-1] + "]"+ ",\n")
    f.write("}")