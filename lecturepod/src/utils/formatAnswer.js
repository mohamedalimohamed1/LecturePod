export function formatAnswerText(text) {
  if (!text) return '';

  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  const lines = text.split('\n');
  let formattedHtml = '';
  let tableRows = [];
  let listItems = [];

  const flushTable = () => {
    if (tableRows.length === 0) return '';
    let html =
      '<div style="overflow-x:auto; margin: 1rem 0;"><table style="width:100%; border-collapse: collapse; border: 1px solid var(--border-color); font-size: 0.9rem;">';
    tableRows.forEach((row, i) => {
      html += `<tr style="${i === 0 ? 'background: rgba(13, 148, 235, 0.1); font-weight: bold;' : 'border-top: 1px solid var(--border-color);'}">`;
      row.forEach((cell) => {
        let cellContent = cell.replace(/[•\*]/g, '<br>• ').trim();
        if (cellContent.startsWith('<br>')) cellContent = cellContent.substring(4);
        html += `<td style="padding: 0.6rem; border: 1px solid var(--border-color); vertical-align: top;">${cellContent}</td>`;
      });
      html += '</tr>';
    });
    html += '</table></div>';
    tableRows = [];
    return html;
  };

  const flushList = () => {
    if (listItems.length === 0) return '';
    let html = '<ul style="margin: 0.5rem 0 1rem 1.2rem; list-style-type: disc;">';
    listItems.forEach((item) => {
      html += `<li style="margin-bottom: 0.3rem;">${item}</li>`;
    });
    html += '</ul>';
    listItems = [];
    return html;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.includes('|')) {
      formattedHtml += flushList();
      const cells = trimmed
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c !== '');
      if (cells.length > 1) {
        tableRows.push(cells);
        return;
      }
    }
    if (/^[•\*\-]\s*/.test(trimmed)) {
      formattedHtml += flushTable();
      listItems.push(trimmed.replace(/^[•\*\-]\s*/, ''));
      return;
    }
    formattedHtml += flushTable();
    formattedHtml += flushList();
    if (trimmed === '') {
      formattedHtml += '<br>';
    } else {
      formattedHtml += `<div>${trimmed.replace(/\t/g, '<span style="display:inline-block; width:20px;"></span>')}</div>`;
    }
  });

  formattedHtml += flushTable();
  formattedHtml += flushList();
  return formattedHtml;
}
