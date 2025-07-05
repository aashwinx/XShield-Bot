const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    try {
      await interaction.reply('Pong!');
    } catch (error) {
      console.error('Ping command error:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: '❌ Something went wrong.' });
      } else {
        await interaction.reply({ content: '❌ Something went wrong.', ephemeral: true });
      }
    }
  }
};