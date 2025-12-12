export const formatBotMessage = ({ title, category, description, updatedAt, score }) => {
  return `
📚 **Knowledge Base**  
**Title:** ${title}  
**Category:** ${category || "N/A"}  
**Description:** ${description}  
*Confidence score: ${score ? score.toFixed(2) : "N/A"}*
`;
};
