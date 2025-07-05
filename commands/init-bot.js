const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('init-bot')
    .setDescription('Set up logging channels and bot permissions for XShield'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
      return;
    }

    try {
      // Create logging channels if they don't exist
      const logChannels = [
        { name: 'mod-logs', type: ChannelType.GuildText },
        { name: 'bot-logs', type: ChannelType.GuildText }
      ];
      const createdChannels = {};
      for (const ch of logChannels) {
        let channel = interaction.guild.channels.cache.find(c => c.name === ch.name);
        if (!channel) {
          channel = await interaction.guild.channels.create({ ...ch, reason: 'XShield bot logging setup' });
        }
        createdChannels[ch.name] = channel;
      }

      // Ensure bot has permissions in these channels
      const botMember = interaction.guild.members.me;
      for (const channel of Object.values(createdChannels)) {
        await channel.permissionOverwrites.edit(botMember, {
          ViewChannel: true,
          SendMessages: true,
          EmbedLinks: true,
          AttachFiles: true
        });
      }

      await interaction.reply({ content: '✅ Logging channels and bot permissions set up!', ephemeral: true });
    } catch (error) {
      console.error(error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Failed to set up logging channels or permissions.', ephemeral: true });
      }
    }
  }
};
