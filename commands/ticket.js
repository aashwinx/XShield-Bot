const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const TICKET_CATEGORY_ID = process.env.GET_SUPPORT_ID; // Uses .env value
const SUPPORT_ROLE_ID = 'YOUR_SUPPORT_ROLE_ID'; // Replace with your support role ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a private support ticket channel'),

  async execute(interaction) {
    // Check if user already has a ticket open
    const existing = interaction.guild.channels.cache.find(
      c => c.name === `ticket-${interaction.user.username}` && c.parentId === TICKET_CATEGORY_ID
    );
    if (existing) {
      await interaction.reply({ content: '❌ You already have an open ticket.', ephemeral: true });
      return;
    }

    // Ensure the support and members roles exist, create if not
    const supportRoleName = "Support Team";
    const membersRoleName = "Members";
    let supportRole = interaction.guild.roles.cache.find(r => r.name === supportRoleName);
    if (!supportRole) {
      supportRole = await interaction.guild.roles.create({
        name: supportRoleName,
        color: 0x3498DB,
        mentionable: true,
        reason: 'Needed for ticket system'
      });
      console.log(`Created role: ${supportRole.name}`);
    }
    let membersRole = interaction.guild.roles.cache.find(r => r.name === membersRoleName);
    if (!membersRole) {
      membersRole = await interaction.guild.roles.create({
        name: membersRoleName,
        color: 0x95A5A6,
        mentionable: true,
        reason: 'Default member role for ticket system'
      });
      console.log(`Created role: ${membersRole.name}`);
    }
    // Assign Members role to all non-bot users
    const assignPromises = interaction.guild.members.cache
      .filter(m => !m.user.bot && !m.roles.cache.has(membersRole.id))
      .map(m => m.roles.add(membersRole, 'Ticket system: default member role'));
    await Promise.all(assignPromises);

    // Create the ticket channel
    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: TICKET_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        },
        {
          id: supportRole.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        },
        // Add Ticket Manager and Ticket Viewer roles if they exist
        ...["Ticket Manager", "Ticket Viewer"].map(roleName => {
          const role = interaction.guild.roles.cache.find(r => r.name === roleName);
          return role ? {
            id: role.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          } : null;
        }).filter(Boolean)
      ]
    });

    // Create a close button
    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeButton);

    await ticketChannel.send({
      content: `Hello <@${interaction.user.id}>, a staff member will be with you shortly!`,
      components: [row]
    });

    await interaction.reply({ content: `✅ Ticket created: ${ticketChannel}`, ephemeral: true });
  }
};
