import * as fs from 'fs';
import * as path from 'path';

import {
  EmailContentInterface,
  EmailContentType,
} from '../interfaces/email.interface';

const html_path = path.join(__dirname, '../html');
const url = 'https://chat.mkwsieci.pl/';

const replaceBindingWithContent = (
  content: string,
  data: EmailContentInterface,
) => {
  const { name, token } = data;

  const bindings = content.match(/\{\{.+\}\}/gi);

  for (const binding of bindings) {
    switch (binding) {
      case '{{name}}':
        content = content.replace(/\{\{name\}\}/g, name);
        break;
      case '{{token}}':
        content = content.replace(/\{\{token\}\}/g, token);
        break;
      case '{{url}}':
        content = content.replace(/\{\{url\}/g, url);
        break;
    }
  }
  return content;
};

export const getEmailContent = (
  type: EmailContentType,
  data: EmailContentInterface,
) => {
  const file_path = path.join(html_path, `/${type}.html`);
  const content = fs.readFileSync(file_path, 'utf-8');
  return replaceBindingWithContent(content, data);
};
