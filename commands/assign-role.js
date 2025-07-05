const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('assign-role')
    .setDescription('Assign a role to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to assign the role to')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('role')
        .setDescription('The name of the role to assign')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({ content: '❌ You need Manage Roles permission to use this command.', ephemeral: true });
      return;
    }
    const user = interaction.options.getUser('user');
    const roleName = interaction.options.getString('role');
    const member = await interaction.guild.members.fetch(user.id);
    const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) {
      await interaction.reply({ content: `❌ Role not found: ${roleName}`, ephemeral: true });
      return;
    }
    if (member.roles.cache.has(role.id)) {
      await interaction.reply({ content: `ℹ️ <@${user.id}> already has the **${role.name}** role.`, ephemeral: true });
      return;
    }
    try {
      await member.roles.add(role, `Assigned by ${interaction.user.tag} via /assign-role`);
      await interaction.reply({ content: `✅ <@${user.id}> has been given the **${role.name}** role.`, ephemeral: false });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Failed to assign the role. Check my permissions and role hierarchy.', ephemeral: true });
    }
  }
};
