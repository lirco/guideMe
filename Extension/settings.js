// ////////////////////////////////////////////////////////////////// 
function GuideMeSettings() {
    this.loadSettings()
}

GuideMeSettings.VERSION = "0.0.1";
GuideMeSettings.SERVER_ROOT = "guide.me";
GuideMeSettings.prototype = {
    prefs: {},
    get: function (a, b) {
        if (this.prefs.hasOwnProperty(a)) return this.prefs[a];
        return b
    },
    getInt: function (a, b) {
        var c = this.get(a, b);
        return parseInt(c)
    },
    getBool: function (a, b) {
        return this.get(a, b) == "true" ? true : false
    },
    set: function (a, b, c) {
        b = String(b);
        this.prefs[a] = b;
        c && localStorage.setItem("pref-" + a, b)
    },
    remove: function (a) {
        delete this.prefs[a];
        localStorage.removeItem("pref-" + a)
    },
    loadSettings: function () {
      
        // Parsing version, TODO: Refactor as this does not correspond to convention
        function a(f, e, g) {
            f = f.split(".");
            e = e.split(".");
            for (var i = f.length > e.length ? f.length : e.length, h = 0; h < i; h++) {
                if (g && h > 1) break;
                var j = f.length > h ? parseInt(f[h]) : 0,
                    k = e.length > h ? parseInt(e[h]) : 0;
                if (j > k) return -1;
                else if (k > j) return 1
            }
            return 0
        }
        
        // Iterate over local storage and get all prefs
        for (var b = 0; b < localStorage.length; b++) {
            var c = localStorage.key(b);
            c.indexOf("pref-") == 0 && this.set(c.substr(5), localStorage.getItem(c))
        }
        
        // Update the server-root 
        this.get("server-root") || this.set("server-root", GuideMeSettings.SERVER_ROOT);
        
        // Set enabled by default
        this.get("enabled") || this.set("enabled", "true");
        
        if (b = this.get("version")) {
            if (a(GuideMeSettings.VERSION, b) < 0) {
                //a(GuideMeSettings.VERSION, b, true) != 0 && this.set("major-upgrade-run", true);
                this.set("version", GuideMeSettings.VERSION, true);
                //this.Set("upgrade-run", true)
            }
        } else {
            this.set("version", GuideMeSettings.VERSION, true);
            this.set("first-run", true)
        }
        
        // Initalize urls 
        b = this.get("server-root");
        c = {
            webserver: "www."
            //authserver: "login.",
            //cloudserver: "cloud.",
            //staticserver: "static.",
            //syncserver: "sync."
        };
        for (var d in c) this.get(d) || this.set(d, c[d] + b)
    },
    getMachineId: function () {
        var a = this.get("machineId");
        if (!a) {
            a = Date.now().toString(36);
            this.set("machineId", a, true)
        }
        return a
    },
    logWrite: function (a) {
        if (this.getBool("disableLogging", "false") == false) {
            var b = new Date,
                c = b.getMonth() + 1,
                d = b.getDate(),
                f = b.getFullYear(),
                e = b.getHours(),
                g = b.getMinutes();
            if (g < 10) g = "0" + g;
            b = b.getSeconds();
            if (b < 10) b = "0" + b;
            console.log("[" + c + "/" + d + "/" + f + " " + e + ":" + g + ":" + b + "] " + a)
        }
    }
};
