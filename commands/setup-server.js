const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-server')
    .setDescription('Initial server setup: creates roles and configures base settings'),

  async execute(interaction) {
    try {
      console.log("⚙️ /setup-server command triggered");

      await interaction.deferReply({ ephemeral: true }); // Prevent timeout

      const rolesToCreate = [
        { name: 'Support Team', color: 0x00b0f4 },
        { name: 'Member', color: 0x2ecc71 },
        { name: 'Verified', color: 0xf1c40f },
      ];

      const createdRoles = [];

      for (const roleData of rolesToCreate) {
        let existing = interaction.guild.roles.cache.find(r => r.name === roleData.name);
        if (!existing) {
          const newRole = await interaction.guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            mentionable: true,
            reason: 'XShield Setup'
          });
          createdRoles.push(newRole.name);
        } else {
          createdRoles.push(`(exists) ${existing.name}`);
        }
      }

      await interaction.editReply({
        content: `✅ Setup complete! Roles:\n${createdRoles.map(r => `• ${r}`).join('\n')}`
      });

    } catch (error) {
      console.error("❌ Error in /setup-server:", error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: '❌ Something went wrong during setup.' });
      } else {
        await interaction.reply({ content: '❌ Something went wrong during setup.', ephemeral: true });
      }
    }
  }
};
