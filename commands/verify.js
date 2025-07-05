require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const logAction = require('../utils/logger.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Assigns a verification role to the user')
    .addRoleOption(option =>
      option.setName('role').setDescription('Role to assign (optional, defaults to "Verified")')),

  async execute(interaction) {
    const roleOption = interaction.options.getRole('role');
    const role = roleOption || interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'verified');
    if (!role) {
      return interaction.reply({ content: 'Verification role not found. Please specify a role or create one named "Verified".', ephemeral: true });
    }
    try {
      await interaction.member.roles.add(role);
      await interaction.reply({ content: `You have been verified and assigned the role: ${role.name}` });
      await logAction({
        client: interaction.client,
        action: 'Verify',
        moderator: interaction.user,
        target: interaction.user,
        reason: `Assigned role: ${role.name}`
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Failed to assign the role. Please contact an admin.', ephemeral: true });
    }
  }
};
