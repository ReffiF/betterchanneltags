/**
 * @name BetterChannelTag
 * @author reffi-dev
 * @authorId 504191032368300032
 * @version 1.0
 * @description Adds a more noticeable Tags to Channels
 * @invite 56Z4azW2ce
 * @source https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/BetterNsfwTag/
 * @updateUrl https://mwittrien.github.io/BetterDiscordAddons/Plugins/BetterNsfwTag/BetterNsfwTag.plugin.js
 */

 module.exports = (_ => {
	const config = {
		"info": {
			"name": "BetterChannelTag",
			"author": "reffi-dev",
			"version": "1.0",
			"description": "Adds a more noticeable Tags to Channels"
		}
	};
	
	return (window.Lightcord && !Node.prototype.isPrototypeOf(window.Lightcord) || window.LightCord && !Node.prototype.isPrototypeOf(window.LightCord) || window.Astra && !Node.prototype.isPrototypeOf(window.Astra)) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return "Do not use LightCord!";}
		load () {BdApi.alert("Attention!", "By using LightCord you are risking your Discord Account, due to using a 3rd Party Client. Switch to an official Discord Client (https://discord.com/) with the proper BD Injection (https://betterdiscord.app/)");}
		start() {}
		stop() {}
	} : !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		return class BetterChannelTag extends Plugin {
			onLoad () {
				this.patchedModules = {
					after: {
						ChannelItem: "default"
					}
				};
				
				this.css = `
					${BDFDB.dotCN.channelcontainerdefault}:hover ${BDFDB.dotCN.channeliconitem} + ${BDFDB.dotCN._betterchanneltagtag} {
						display: none;
				`;
			}
			
			onStart () {
				BDFDB.ChannelUtils.rerenderAll();
			}
			
			onStop () {
				BDFDB.ChannelUtils.rerenderAll();
			}

			processChannelItem (e) {
				if (e.instance.props.channel && e.instance.props.channel.nsfw) e.instance.props.children.push(BDFDB.ReactUtils.createElement("div", {
					className: BDFDB.disCNS._betterchanneltagtag + BDFDB.disCN.channelchildiconbase,
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.TextBadge, {
						style: {borderRadius: "3px"},
						text: "NSFW"
					})
				}));
				
				else if (e.instance.props.channel.type === 0) e.instance.props.children.push(BDFDB.ReactUtils.createElement("div", {
					className: BDFDB.disCNS._betterchanneltagtag + BDFDB.disCN.channelchildiconbase,
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.TextBadge, {
						style: {borderRadius: "3px"},
						color: "BLUE",
						text: "TEXT"
					})
				}));
				
				else if (e.instance.props.channel.type === 2) e.instance.props.children.push(BDFDB.ReactUtils.createElement("div", {
					className: BDFDB.disCNS._betterchanneltagtag + BDFDB.disCN.channelchildiconbase,
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.TextBadge, {
						style: {borderRadius: "3px"},
						color: "GREEN",
						text: "VOICE"
					})
				}));
				
				else if (e.instance.props.channel.type === 5) e.instance.props.children.push(BDFDB.ReactUtils.createElement("div", {
					className: BDFDB.disCNS._betterchanneltagtag + BDFDB.disCN.channelchildiconbase,
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.TextBadge, {
						style: {borderRadius: "3px"},
						color: "PURPLE",
						text: "NEWS"
					})
				}));
				
				else if (e.instance.props.channel.type === 13) e.instance.props.children.push(BDFDB.ReactUtils.createElement("div", {
					className: BDFDB.disCNS._betterchanneltagtag + BDFDB.disCN.channelchildiconbase,
					children: BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Badges.TextBadge, {
						style: {borderRadius: "3px"},
						color: "ORANGE",
						text: "STAGE VOICE"
					})
				}));
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
