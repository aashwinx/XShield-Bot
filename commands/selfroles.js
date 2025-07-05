const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('selfroles')
    .setDescription('Send a self-role selector menu')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('selfrole_menu')
      .setPlaceholder('Choose your role!')
      .addOptions([
        { label: 'Developer', value: 'Developer', description: 'Get the Developer role' },
        { label: 'Designer', value: 'Designer', description: 'Get the Designer role' },
        { label: 'Beta Tester', value: 'Beta Tester', description: 'Get the Beta Tester role' },
        { label: 'Verified Member', value: 'Verified Member', description: 'Get the Verified Member role' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);
    await interaction.reply({ content: 'Select your role from the menu below:', components: [row], ephemeral: true });
  }
};
