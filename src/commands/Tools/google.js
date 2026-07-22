import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

export default {
    data: new SlashCommandBuilder()
        .setName('google')
        .setDescription('Search for information on Google')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('What do you want to find?')
                .setRequired(true)),
    
    async execute(interaction) {
        // Defer the reply since the Google API request takes a few seconds
        await interaction.deferReply();
        
        const query = interaction.options.getString('query');
        
        // Construct the URL using the environment variables you saved in Railway
        const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(url);
            
            // Check if Google returned any results
            if (response.data.items && response.data.items.length > 0) {
                const results = response.data.items;
                
                // Get the top 3 results to keep the message clean
                let replyText = `**Search results for:** *${query}*\n\n`;
                
                for (let i = 0; i < Math.min(results.length, 3); i++) {
                    replyText += `**${i + 1}. [${results[i].title}](${results[i].link})**\n${results[i].snippet}\n\n`;
                }
                
                // Send the formatted list back to Discord
                await interaction.editReply(replyText);
            } else {
                await interaction.editReply('Google could not find anything for this query.');
            }
        } catch (error) {
            console.error('Google Search API Error:', error);
            await interaction.editReply('An error occurred while trying to perform the search. Check the bot logs.');
        }
    },
};
