export const formatBotMessage = ({ title, category, description, updatedAt, score }) => {
  return `
📚 **Knowledge Base**  
**Category:** ${category || "N/A"}  
**${title}**  
${description} 
`;
};
