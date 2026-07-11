export function isValidTitle(title: string): boolean {
  return title.trim().length >= 3 && title.trim().length <= 200;
}

export function isValidContent(content: string): boolean {
  return content.trim().length >= 10;
}

export function isValidExcerpt(excerpt: string): boolean {
  return excerpt.trim().length >= 10 && excerpt.trim().length <= 500;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function isValidTags(tags: string[]): boolean {
  return tags.length > 0 && tags.every((tag) => tag.trim().length > 0);
}
