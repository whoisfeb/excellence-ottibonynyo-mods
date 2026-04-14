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
    ANNOUNCE_CHANNEL: '1493745152777523332',
    LOG_CHANNEL: '1469911922886443141',
    ADMIN_ROLE_ID: '1435255770609487932', 
    QRIS_FILE_NAME: 'qrisgopay.png' ,
    ALLOWED_CHANNELS: [
        '1449340767347933268', 
        '1449385133864914995',
        '1449339948049236089'// Tambahkan ID channel lain di sini, pisahkan dengan koma
    ]
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
    "Excellence Roleplay adalah server terbaik sepanjang masa\n Jangan lupa share link discord Excellence Roleplay ke teman, keluarga atau bahkan grup sekolah kalian ya\nhttps://discord.gg\n@everyone.",
    "Halo @everyone , seru ga bermain di Excellence? apa? anda baru join? kalau baru join langsung <#1449372083594330233>",
    "Kami segenap pengurus Excellence Roleplay berterima kasih ke kalian yang telah mendukung komunitas ini \n @everyone!",
    "⚠️ **ANNOUNCEMENT**\n\nDihimbau kepada seluruh <@&1449324471856005130> untuk **tidak sembarangan bergabung (join) ke link Discord yang tidak jelas atau tidak resmi**.\n\nKami menemukan adanya beberapa link mencurigakan yang berpotensi:\n- Mengandung scam / penipuan\n- Phishing (pencurian akun)\n- Malware / virus\n\n🔒 **Keamanan akun adalah tanggung jawab masing-masing.**\nSegala bentuk kerugian akibat join link di luar server resmi bukan tanggung jawab pihak kami.\n\n📌 **Harap diperhatikan:**\n* Hanya join link yang dibagikan oleh admin resmi\n* Jangan mudah percaya dengan DM/link dari orang tidak dikenal\n\n**Tetap waspada dan jaga keamanan akun kalian.**\n\n- <@&1435255770609487932>\n@everyone",
    "# ANNOUNCEMENT \n\nHalo <@&1449324471856005130> 👋\nKami menegaskan bahwa server ini memiliki kebijakan **ZERO TOLERANCE** terhadap segala bentuk pelecehan, baik secara verbal, tulisan, maupun tindakan dalam roleplay maupun di luar roleplay.\n\n⚠️ Termasuk:\n• Pelecehan seksual\n• Catcalling / komentar tidak pantas\n• DM tidak sopan / mengganggu\n• Body shaming\n• Candaan berlebihan yang bersifat merendahkan\n• Pelecehan OOC maupun IC \n\nTidak ada alasan “bercanda”. Tidak ada alasan “hanya RP”. Jika melewati batas, tindakan akan diambil.\n\n📩 Jika kalian mengalami atau melihat tindakan pelecehan: Segera laporkan ke admin disertai bukti yang valid. Sanksi tegas menanti dari warning hingga **BANNED PERMANENT**.\n@everyone",
    "**INFO PERMASALAHAN SERVER**\n\n**Kesalahan Admin:** Dilarang debat OOC di game, lapor via ticket/channel resmi.\n**Bug / Error:** Wajib lapor! Dilarang memanfaatkan bug (abuse).\n**Report Player:** Gunakan fitur report dengan bukti jelas. Fitnah = Sanksi.\n**Kritik & Saran:** Sampaikan dengan sopan di channel yang disediakan.\n\nMari kita menjaga kenyamanan di Excellence Roleplay.\n#HAPPYROLEPLAY <@&1449324471856005130>\n@everyone",
    "Di Excellence Roleplay, cerita besar dimulai dari langkah kecil. Ayo buat ceritamu!\n@everyone",
    "Bukan seberapa hebat senjatamu, tapi seberapa kuat alur ceritamu di Excellence.\n@everyone",
    "Jadilah legenda di kota ini, bukan sekadar nama di papan skor. Login sekarang!\n@everyone",
    "Excellence Roleplay: Tempat di mana imajinasi bertemu dengan realita SAMP.\n@everyone",
    "Karaktermu adalah cerminan dirimu, buatlah ia berkesan bagi warga lain.\n@everyone",
    "Hargai setiap proses, karena setiap skenario punya makna mendalam.\n@everyone",
    "Kota ini keras, tapi tekadmu harus lebih keras untuk bertahan di Excellence.\n@everyone",
    "Di Excellence, kita tidak hanya bermain, kita menciptakan sejarah bersama.\n@everyone",
    "Roleplay bukan tentang menang atau kalah, tapi tentang rasa dan kualitas.\n@everyone",
    "Jalin koneksi, bangun relasi, kuasai ekonomi Excellence Roleplay.\n@everyone",
    "Aspal Excellence tidak pernah tidur, begitu juga dengan ambisi kami semua.\n@everyone",
    "Satu peluru bisa mengakhiri hidup, tapi satu pengkhianatan mengakhiri segalanya.\n@everyone",
    "Loyalitas itu mahal, jangan harapkan dari orang murahan di kota ini.\n@everyone",
    "Kami bicara lewat aksi, bukan sekadar janji manis di depan SAPD.\n@everyone",
    "Warna baju boleh beda, tapi rasa hormat antar player tetap yang utama.\n@everyone",
    "Jangan cari masalah jika belum siap menanggung resiko di Excellence!\n@everyone",
    "Di gang sempit Excellence, persaudaraan adalah segalanya bagi kami.\n@everyone",
    "Sirine polisi adalah musik pengantar tidur bagi para outlaw kota.\n@everyone",
    "Hati-hati berucap, dinding Excellence punya telinga yang siap melapor.\n@everyone",
    "Kekuasaan bukan diberikan, tapi direbut dengan keringat dan darah.\n@everyone",
    "Melayani dengan hati, melindungi Excellence dengan nyawa. Salam SAPD!\n@everyone",
    "Jangan coba-coba lari, radar kami lebih luas dari pelarianmu warga!\n@everyone",
    "Hukum adalah harga mati di Excellence Roleplay. Patuhi atau dipenjara!\n@everyone",
    "Tangan kanan memegang borgol, tangan kiri memegang keadilan kota.\n@everyone",
    "Sirene kami adalah peringatan, bukan ajakan untuk balapan liar.\n@everyone",
    "Excellence aman karena kami tetap berjaga saat kalian terlelap tidur.\n@everyone",
    "Integritas adalah seragam yang kami pakai setiap hari bertugas.\n@everyone",
    "Tidak ada tempat bagi kriminal di sudut kota Excellence. Kami mengawasi!\n@everyone",
    "Patroli pagi, amankan kota, demi Excellence yang lebih baik lagi.\n@everyone",
    "Tertib berlalu lintas atau siap-siap dompetmu terkuras denda!\n@everyone",
    "Kerja keras di siang hari, party di malam hari. Itulah vibe Excellence.\n@everyone",
    "Dari supir taksi sampai CEO, semua punya cerita unik di Excellence.\n@everyone",
    "Cari uang halal itu susah, tapi di Excellence selalu ada jalan bagi yang mau.\n@everyone",
    "Mancing tenang di pier, sambil menunggu senja Excellence yang indah.\n@everyone",
    "Jangan remehkan warga sipil, kami adalah nyawa dari kota besar ini.\n@everyone",
    "Membangun ekonomi kota, satu crate pada satu waktu. Semangat kerja!\n@everyone",
    "Nge-bus dulu baru nge-boss, semuanya butuh proses dan kesabaran.\n@everyone",
    "Excellence Roleplay: Tempat imajinasi bisa menjadi nyata dalam karakter.\n@everyone",
    "Gaji masuk, dompet penuh, hati senang belanja di Excellence.\n@everyone",
    "Kopi hangat dan suasana kota Excellence, kombinasi sempurna pagi ini.\n@everyone",
    "Roleplay elit, bayar denda flatbed sulit. Ayo kerja jangan malas!\n@everyone",
    "Bukannya takut polisi, cuma takut denda flatbed lebih mahal dari gaji.\n@everyone",
    "Cintaku padamu seperti admin Excellence, selalu mengawasi tiap saat.\n@everyone",
    "Udah ganteng, udah keren, eh malah kena /jail gara-gara DM. Pelajari rules!\n@everyone",
    "Hati ini bukan mobil yang bisa kamu repair seenaknya di mekanik.\n@everyone",
    "Jangan nanya 'kapan nikah' di IC, nanya 'kapan bagi uang' aja lebih asik.\n@everyone",
    "Jago nembak di server, tapi gak berani nembak gebetan di RL? Cupu!\n@everyone",
    "Hidup itu seperti lag, kadang lancar kadang bikin emosi jiwa.\n@everyone",
    "Lari dari kenyataan itu susah, mending lari dari kejaran SAPD kota.\n@everyone",
    "Excellence Roleplay: Tempat di mana saya lebih kaya daripada dunia nyata.\n@everyone",
    "Setiap orang punya topeng, di Excellence kita bebas memilih peran kita.\n@everyone",
    "Jangan biarkan emosi OOC merusak indahnya skenario IC yang sudah dibangun.\n@everyone",
    "Hargai lawan roleplay-mu, karena tanpa mereka ceritamu hambar rasa.\n@everyone",
    "Kejayaan itu sementara, tapi kesan yang kamu tinggalkan itu selamanya.\n@everyone",
    "Belajarlah menghargai waktu orang lain di dalam kota saat berinteraksi.\n@everyone",
    "Bukan tentang seberapa banyak uangmu, tapi seberapa berkualitas RP-mu.\n@everyone",
    "Kesalahan adalah pelajaran, jangan baper jika kalah dalam skenario.\n@everyone",
    "Excellence adalah wadah kreativitas, dan kamu adalah senimannya.\n@everyone",
    "Tinggalkan jejak baik di setiap sudut Excellence Roleplay hari ini.\n@everyone",
    "Roleplay yang baik dimulai dari attitude player yang baik pula.\n@everyone",
    "Stay Clean, Stay Excellence. Jaga nama baik komunitas kita bersama!\n@everyone",
    "Excellence Roleplay: My City, My Rules. Mari kita ramaikan!\n@everyone",
    "Born to be Excellence. Buktikan kemampuanmu di dalam kota!\n@everyone",
    "Loyalty Above All. Kesetiaan adalah segalanya di server ini.\n@everyone",
    "Create Your Story. Jangan biarkan orang lain mengatur alur hidupmu.\n@everyone",
    "Respect the Staff, Love the Community. Mari jaga keharmonisan kita.\n@everyone",
    "No Excellence, No Party. Login sekarang dan rasakan keseruannya!\n@everyone",
    "Simpel tapi Berkualitas. Itulah standar Roleplay di Excellence.\n@everyone",
    "Rumah kedua: Excellence Roleplay. Tempat pulang paling nyaman.\n@everyone",
    "Justice for Excellence. Tegakkan keadilan di setiap sudut jalanan!\n@everyone",
    "Admin bukan tuhan, tapi penjaga kenyamanan kita semua di server.\n@everyone",
    "Report jika butuh, jangan spam jika tak ingin di-kick dari server.\n@everyone",
    "Komunitas sehat, Roleplay makin nikmat. Yuk jaga lisan dan ketikan.\n@everyone",
    "Terima kasih Excellence telah mempertemukan kami dengan kawan baru.\n@everyone",
    "Saran kalian adalah pondasi kemajuan Excellence ke depannya.\n@everyone",
    "Dukung terus Excellence agar makin didepan dan makin rame warga!\n@everyone",
    "Staff ramah, warga betah. Itulah keunggulan Excellence Roleplay.\n@everyone",
    "Beda kota, beda rasa, tapi Excellence tetap juaranya di hati.\n@everyone",
    "Kritik membangun, bukan menjatuhkan. Sampaikan dengan cara sopan.\n@everyone",
    "Satu visi, satu misi, satu Excellence Roleplay selamanya.\n@everyone",
    "Siapkan senjatamu, Excellence sedang membara dengan persaingan!\n@everyone",
    "Darah akan tumpah, kehormatan akan dipertaruhkan malam ini di kota.\n@everyone",
    "Saatnya yang muda yang berkuasa di jalanan Excellence Roleplay.\n@everyone",
    "Goncangkan kota dengan raungan mesin v8-mu warga! Ayo balapan!\n@everyone",
    "Kegelapan mulai menyelimuti Excellence, siapa yang akan bertahan hidup?\n@everyone",
    "Jangan berkedip, atau kamu akan kehilangan momen berhargamu di kota.\n@everyone",
    "Setiap detik di Excellence adalah adrenalin yang tak terduga.\n@everyone",
    "Buktikan kalau kamu memang layak menjadi warga Excellence sejati.\n@everyone",
    "Bangkit atau hancur di jalanan Excellence. Pilihan ada di tanganmu.\n@everyone",
    "Ini bukan sekadar permainan, ini adalah pertempuran mental dan taktik.\n@everyone",
    "Masih ragu? Masuk dulu baru tahu serunya Excellence sesungguhnya.\n@everyone",
    "Undang temanmu, bangun dinasti terkuat di Excellence Roleplay.\n@everyone",
    "Bosan hidup biasa? Jadi luar biasa di Excellence sekarang juga!\n@everyone",
    "Temukan jati dirimu yang sebenarnya di dalam karakter unikmu.\n@everyone",
    "Jangan cuma jadi penonton, jadilah pemeran utama di Excellence!\n@everyone",
    "Excellence Roleplay menantang kreativitasmu dalam ber-roleplay.\n@everyone",
    "Siapkan dirimu, sejarah besar kota ini akan segera diukir olehmu.\n@everyone",
    "Excellence Roleplay: Excellence is not an act, it's a habit.\n@everyone"
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
            announceChannel.send(`📢 **Excellence Guard**\n\n${text}`);
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
    // 1. LOGIKA ANTI-BADWORD (Lebih Akurat)
    // Regex ini memastikan kata kasar harus berdiri sendiri (bukan bagian dari kata lain)
    const foundBadWord = BADWORDS.find(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i'); // \b adalah boundary (batas kata)
        return regex.test(message.content);
    });
    
    if (foundBadWord) {
        try {
            await message.delete();
            return message.channel.send(`Hey ${message.author}, astagfirullah tidak boleh mengetik kata kata kasar yah sayang!`);
        } catch (error) {
            console.error('[ERROR] Gagal menghapus pesan kasar:', error);
        }
        return; 
    }


    // 2. AUTO RESPONSE (Hanya jalan di channel yang ada dalam daftar ALLOWED_CHANNELS)
    if (CONFIG.ALLOWED_CHANNELS.includes(message.channel.id)) {
        const autoResponses = [
            `Halo <@${message.author.id}>! Ada yang bisa dibantu?`,
            "Halo! kak kenapa nih apakah anda sedang kesusahan jika sedang kesusahan tunggu saja ya nanti akan di respon oleh <@&1435256476011860171>",
            "Admin akan segera merespon chat kamu, mohon ditunggu ya.",
            "Kenapa sayang ih, kamu kangen aku ya, jangan kangen kangen ya mending login aja.",
            "Kenapa sayang kangen?, ih sini ||login|| ih bareng aku."
        ];

        if (Math.random() < 0.3) {
            message.reply(autoResponses[Math.floor(Math.random() * autoResponses.length)]);
        }
    }
});


client.login(CONFIG.DISCORD_TOKEN);
