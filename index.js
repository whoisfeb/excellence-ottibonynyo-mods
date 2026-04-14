const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActivityType, 
    REST, 
    Routes,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// --- KONFIGURASI ---
const CONFIG = {
    TOKEN: process.env.DISCORD_TOKEN,
    CLIENT_ID: '1493474526464442469', 
    GUILD_ID: '1435214111121084500',  
    ANNOUNCE_CHANNEL: '1449361056425054381',
    LOG_CHANNEL: '1469911922886443141',
    ADMIN_ROLE_ID: '1435255770609487932', 
    QRIS_FILE_NAME: 'qrisgopay.png' 
};

// --- DAFTAR KATA KASAR ---
const BADWORDS = [
  'free', 'tolol', 'goblok', 'bego', 'pepek', 'dongo', 'tai', 'kontol', 
  'bio', 'sexcam', 'entot', 'ngentot', 'join', 'invite', 'anjing', 
  'babi', 'memek', 'ngewe', 'ewe', 'lonte', 'pler', 'bgst', 'bangsat'
];


const RANDOM_MESSAGES = [
    "Ayo Login dan Ramaikan Excellence Roleplay\n@everyone!",
    "Halo apakabar semua ap akah kalian sehat sehat saja?\nAlhamdulillah jika anda sehat sehat saja\nAyo kita ramaikan Excellence Roleplay jika anda menemukan bug silahkan laporkan ke <#1449406590661689405>, namun jika anda melihat player yang melakukan kesalahan silahkan laporkan di <#1449612905736573121>\n@everyone",
    "Excellence Roleplay adalah server terbaik sepanjang masa\n Jangan lupa share link discord Excellence Roleplay ke teman, keluarga atau bahkan grup sekolah kalian ya\nhttps://discord.gg/j2sXhvc9hN\n@everyone.",
    "Halo @everyone , seru ga bermain di Excellence? apa? anda baru join? kalau baru join langsung <#1449372083594330233>",
    "Kami segenap pengurus Excellence Roleplay berterima kasih ke kalian yang telah mendukung komunitas ini \n @everyone!"
];

// --- REGISTER SLASH COMMANDS ---
const commands = [
    {
        name: 'payment',
        description: 'Menampilkan informasi metode pembayaran resmi store',
    },
];

const rest = new REST({ version: '10' }).setToken(CONFIG.TOKEN);

async function registerCommands() {
    try {
        console.log('[SYSTEM] Mendaftarkan Slash Commands...');
        await rest.put(
            Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
            { body: commands },
        );
        console.log('[SYSTEM] Slash Commands berhasil didaftarkan!');
    } catch (error) {
        console.error(error);
    }
}

client.once('ready', async () => {
    console.log(`[LOG] Berhasil masuk sebagai ${client.user.tag}`);
    await registerCommands();

    client.user.setPresence({
        activities: [{ name: 'Community Store', type: ActivityType.Watching }],
        status: 'online',
    });

    const logChannel = client.channels.cache.get(CONFIG.LOG_CHANNEL);
    if (logChannel) {
        const onlineEmbed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('🚀 System Core Online')
            .addFields(
                { name: '📡 Status', value: '` Online `', inline: true },
                { name: '⚡ Latency', value: `\` ${client.ws.ping}ms \``, inline: true }
            )
            .setTimestamp();
        logChannel.send({ embeds: [onlineEmbed] });
    }

    setInterval(() => {
        const announceChannel = client.channels.cache.get(CONFIG.ANNOUNCE_CHANNEL);
        if (announceChannel) {
            const text = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
            announceChannel.send(`📢 **INFO STORE**\n\n${text}`);
        }
    }, 3600000);
});

// --- EVENT: INTERACTION (SLASH COMMANDS & BUTTONS) ---
client.on('interactionCreate', async (interaction) => {
    
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'payment') {
            
            // CEK ROLE ID ADMIN
            if (!interaction.member.roles.cache.has(CONFIG.ADMIN_ROLE_ID)) {
                return interaction.reply({ 
                    content: '❌ Kamu tidak memiliki izin (Role Admin) untuk menggunakan perintah ini!', 
                    ephemeral: true 
                });
            }

            const qrisFile = new AttachmentBuilder(`./${CONFIG.QRIS_FILE_NAME}`);

            const paymentEmbed = new EmbedBuilder()
                .setTitle('💳 METODE PEMBAYARAN RESMI')
                .setColor(0x00FF00)
                .setDescription('Scan QRIS di bawah ini atau klik tombol untuk metode pembayaran lainnya:')
                .setImage(`attachment://${CONFIG.QRIS_FILE_NAME}`)
                .setFooter({ text: 'Community Store • Harap lampirkan bukti transfer.' })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pay_bank_info')
                        .setLabel('Transfer Bank')
                        .setEmoji('🏦')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('pay_gopay_info')
                        .setLabel('Nomor GoPay')
                        .setEmoji('📱')
                        .setStyle(ButtonStyle.Secondary),
                );

            await interaction.reply({ 
                embeds: [paymentEmbed], 
                files: [qrisFile],
                components: [row] 
            });
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'pay_bank_info') {
            await interaction.reply({ 
                content: '📌 **Detail Transfer Bank:**\n- **Bank BRI:** `0021-01-xxxxxx`\n- **Bank Mandiri:** `124-00-xxxxxx`\n\n*Kirim bukti transfer ke admin jika sudah membayar.*', 
                ephemeral: true 
            });
        }

        if (interaction.customId === 'pay_gopay_info') {
            await interaction.reply({ 
                content: '📌 **Detail GoPay:**\nNomor: `0812-xxxx-xxxx` (A/N Toko Kamu)\n\n*Kirim bukti transfer ke admin jika sudah membayar.*', 
                ephemeral: true 
            });
        }
    }
});

// --- EVENT: MESSAGE MONITORING (ANTI-BADWORD & AUTO RESPONSE) ---
// --- EVENT: MESSAGE MONITORING (ANTI-BADWORD & AUTO RESPONSE) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // 1. LOGIKA ANTI-BADWORD (Berjalan di SEMUA channel)
    // Menggunakan .find() untuk menangkap kata yang terdeteksi
    const foundBadWord = BADWORDS.find(word => message.content.toLowerCase().includes(word));

    if (foundBadWord) {
        try {
            await message.delete();
            // Menampilkan kata yang dilarang di dalam pesan peringatan
            return message.channel.send(`Hey ${message.author}, astagfirullah tidak boleh mengetik kata **"${foundBadWord}"** itu ya!`);
        } catch (error) {
            console.error('[ERROR] Gagal menghapus pesan kasar:', error);
        }
        return; 
    }

    // 2. LOGIKA AUTO RESPONSE (Hanya di channel spesifik)
    const TARGET_CHANNEL_ID = '1449340767347933268'; 

    if (message.channel.id === TARGET_CHANNEL_ID) {
        const autoResponses = [
            `Halo ${message.author.username}! Ada yang bisa dibantu?`,
            "Halo! kak kenapa nih apakah anda sedang kesusahan jika sedang kesusahan tunggu saja ya nanti akan di respon oleh <@&1435256476011860171>",
            "Admin akan segera merespon chat kamu, mohon ditunggu ya."
        ];

        if (Math.random() < 0.3) {
            message.reply(autoResponses[Math.floor(Math.random() * autoResponses.length)]);
        }
    }
});


client.login(CONFIG.DISCORD_TOKEN);
