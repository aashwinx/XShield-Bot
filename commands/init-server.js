const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('init-server')
    .setDescription('Automate server setup: roles, channels, self-roles, ticket panel'),

  async execute(interaction) {
    try {
      console.log('init-server command received');
      await interaction.deferReply({ ephemeral: true });
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.editReply({ content: '❌ You need Administrator permission to use this command.' });
        return;
      }

      // 1. Create roles
      const rolesToCreate = [
        { name: 'Support Team', color: 0x3498DB, mentionable: true },
        { name: 'Verified', color: 0x2ECC71, mentionable: true },
        { name: 'Members', color: 0x95A5A6, mentionable: true }
      ];
      const createdRoles = {};
      for (const roleData of rolesToCreate) {
        let role = interaction.guild.roles.cache.find(r => r.name === roleData.name);
        if (!role) {
          role = await interaction.guild.roles.create({ ...roleData, reason: 'Server initialization' });
        }
        createdRoles[roleData.name] = role;
      }

      // 2. Create channels
      const channelsToCreate = [
        { name: 'get-your-roles', type: ChannelType.GuildText },
        { name: 'support', type: ChannelType.GuildText }
      ];
      const createdChannels = {};
      for (const ch of channelsToCreate) {
        let channel = interaction.guild.channels.cache.find(c => c.name === ch.name);
        if (!channel) {
          channel = await interaction.guild.channels.create({ ...ch, reason: 'Server initialization' });
        }
        createdChannels[ch.name] = channel;
      }

      // 3. Post self-role embed in #get-your-roles
      const selfRoleEmbed = new EmbedBuilder()
        .setTitle('Get Your Roles!')
        .setDescription('React below to assign yourself a role.')
        .setColor(0x7289DA);
      const selfRoleRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('selfrole_verified').setLabel('Verified').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('selfrole_member').setLabel('Member').setStyle(ButtonStyle.Primary)
      );
      await createdChannels['get-your-roles'].send({ embeds: [selfRoleEmbed], components: [selfRoleRow] });

      // 4. Register ticket panel in #support
      const ticketPanelEmbed = new EmbedBuilder()
        .setTitle('Need Help?')
        .setDescription('Click below to open a support ticket!')
        .setColor(0x3498DB);
      const ticketPanelRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('Open Ticket').setStyle(ButtonStyle.Primary)
      );
      await createdChannels['support'].send({ embeds: [ticketPanelEmbed], components: [ticketPanelRow] });

      await interaction.editReply({ content: '✅ Server initialized: roles, channels, self-role and ticket panel set up!' });
    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: '❌ Something went wrong during setup.' });
      } else {
        await interaction.reply({ content: '❌ Something went wrong during setup.', ephemeral: true });
      }
    }
  }
};
