const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Инициализация Gemini (ключ берется из переменных окружения)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('askgemini')
        .setDescription('Задать вопрос ИИ Gemini')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('your question')
                .setRequired(true)),
    
    async execute(interaction) {
        // Показываем, что бот думает
        await interaction.deferReply();

        try {
            const question = interaction.options.getString('question');
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            
            const result = await model.generateContent(question);
            const response = await result.response;
            const text = response.text();

            // Отправляем ответ
            await interaction.editReply(`**Question:** ${question}\n\n**Answer:** ${text}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('error. try again i guess... :|');
        }
    },
};
