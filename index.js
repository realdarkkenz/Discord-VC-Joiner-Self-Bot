const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require(`${process.cwd()}/config.json`);

for (const token of config.Tokens) {
    startClient(token);
}

function startClient(token) {
    const client = new Client({ checkUpdate: false });

    client.on('ready', async () => {
        console.log(`✅ Logged: ${client.user.tag}`);
        await joinVC(client);
    });

    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (oldState.member.id !== client.user.id) return;

        const oldVoice = oldState.channelId;
        const newVoice = newState.channelId;

        if (oldVoice && (!newVoice || newVoice !== config.Channel)) {
            await joinVC(client);
        }
    });

    client.login(token);
}

async function joinVC(client) {
    try {
        const guild = client.guilds.cache.get(config.Guild);
        const voiceChannel = guild?.channels.cache.get(config.Channel);

        if (!guild || !voiceChannel) {
            console.log(`[${client.user.tag}] Server or channel not found!`);
            return;
        }

        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });

        console.log(`[${client.user.tag}] Joined the voice channel.`);

    } catch (err) {
        console.error(`[${client.user?.tag || 'Unknown'}] Connection Error:`, err);
    }
}
