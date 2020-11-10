domains = []

with open("blocked.txt") as f:
    
    for domain in f.read().split("\n"):
        domains.append((domain.lstrip("||")).rstrip("^\n"))

with open("blocked.js", "w") as f:
    f.write("var blocked_domains = [\n")
    for domain in domains:
        if "Hostname" in domain:
            continue
        parsed_domain = "*://*." + domain + "/*"
        f.write("\"" + parsed_domain + "\",\n")
    f.write("]")