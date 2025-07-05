const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xshield-setup')
    .setDescription('Auto-create roles and prepare server for ticketing and moderation'),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.editReply({ content: '❌ You need Administrator permission to use this command.' });
        return;
      }

      // Roles to create
      const rolesToCreate = [
        { name: 'Support Team', color: 0x3498DB, mentionable: true },
        { name: 'Members', color: 0x95A5A6, mentionable: true }
      ];
      const createdRoles = {};
      for (const roleData of rolesToCreate) {
        let role = interaction.guild.roles.cache.find(r => r.name === roleData.name);
        if (!role) {
          role = await interaction.guild.roles.create({ ...roleData, reason: 'XShield setup' });
        }
        createdRoles[roleData.name] = role;
      }

      // Add more ticket-related roles if needed
      const extraRoles = [
        { name: 'Ticket Manager', color: 0xE67E22, mentionable: true },
        { name: 'Ticket Viewer', color: 0x1ABC9C, mentionable: true }
      ];
      for (const roleData of extraRoles) {
        let role = interaction.guild.roles.cache.find(r => r.name === roleData.name);
        if (!role) {
          role = await interaction.guild.roles.create({ ...roleData, reason: 'XShield setup: ticket-related role' });
        }
        createdRoles[roleData.name] = role;
      }

      // Assign Members role to all users (except bots)
      const membersRole = createdRoles['Members'];
      if (membersRole) {
        const assignPromises = interaction.guild.members.cache
          .filter(m => !m.user.bot && !m.roles.cache.has(membersRole.id))
          .map(m => m.roles.add(membersRole, 'XShield setup: default member role'));
        await Promise.all(assignPromises);
      }

      await interaction.editReply({ content: '✅ XShield setup complete! Roles created and assigned.' });
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
