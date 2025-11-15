import axios from 'axios';
import * as cheerio from 'cheerio';
import { isIP } from 'node:net';
import { logger } from '../logger';

export class LinkPreviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LinkPreviewError';
  }
}

export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  domain: string;
  faviconUrl: string;
  type: 'article' | 'video' | 'tool' | 'social' | 'other';
}

export interface GitHubRepoInfo {
  name: string;
  description: string;
  stars: number;
  language: string;
  repoUrl: string;
  demoUrl: string;
  topics: string[];
}

export class LinkPreviewService {
  private readonly maxContentLength = 1024 * 1024; // 1MB
  private readonly allowedProtocols = new Set(['http:', 'https:']);

  private validateUrl(input: string): URL {
    let url: URL;
    try {
      url = new URL(input);
    } catch {
      throw new LinkPreviewError('Invalid URL');
    }

    if (!this.allowedProtocols.has(url.protocol)) {
      throw new LinkPreviewError('Unsupported protocol');
    }

    const hostname = url.hostname.toLowerCase();

    if (this.isBlockedHostname(hostname)) {
      throw new LinkPreviewError('Access to the requested host is not allowed');
    }

    if (isIP(hostname) && this.isPrivateNetwork(hostname)) {
      throw new LinkPreviewError('Access to private networks is not allowed');
    }

    return url;
  }

  private isBlockedHostname(hostname: string) {
    if (!hostname) {
      return true;
    }

    return (
      hostname === 'localhost' ||
      hostname === '0.0.0.0' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    );
  }

  private isPrivateNetwork(hostname: string) {
    const ipVersion = isIP(hostname);

    if (ipVersion === 4) {
      const octets = hostname.split('.').map(Number);
      if (octets.length !== 4 || octets.some((octet) => Number.isNaN(octet))) {
        return true;
      }

      return (
        octets[0] === 10 ||
        octets[0] === 127 ||
        (octets[0] === 192 && octets[1] === 168) ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 169 && octets[1] === 254)
      );
    }

    if (ipVersion === 6) {
      return (
        hostname.startsWith('fc') ||
        hostname.startsWith('fd') ||
        hostname.startsWith('fe80') ||
        hostname === '::1'
      );
    }

    return false;
  }

  private async preflight(url: URL) {
    try {
      const response = await axios.head(url.toString(), {
        timeout: 5000,
        maxRedirects: 2,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      const contentLengthHeader = response.headers['content-length'];
      if (contentLengthHeader) {
        const contentLength = Number(contentLengthHeader);
        if (!Number.isNaN(contentLength) && contentLength > this.maxContentLength) {
          throw new LinkPreviewError('Response is too large to process');
        }
      }
    } catch (error) {
      if (error instanceof LinkPreviewError) {
        throw error;
      }

      logger.debug('Link preview preflight failed', {
        url: url.toString(),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Fetch preview information from a URL using Open Graph tags
   */
  async fetchPreview(url: string): Promise<LinkPreview> {
    try {
      const urlObj = this.validateUrl(url);
      await this.preflight(urlObj);

      const domain = urlObj.hostname;
      const origin = urlObj.origin;

      const response = await axios.get(urlObj.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PersonalOS/1.0)',
        },
        timeout: 10000,
        maxRedirects: 5,
        maxContentLength: this.maxContentLength,
        maxBodyLength: this.maxContentLength,
        responseType: 'text',
        validateStatus: (status) => status >= 200 && status < 400,
      });

      const $ = cheerio.load(response.data);

      // Extract Open Graph tags
      const title =
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text() ||
        '';

      const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';

      let image =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[property="og:image:url"]').attr('content') ||
        $('meta[name="twitter:image:src"]').attr('content') ||
        '';

      // Handle relative image URLs
      if (image && !image.startsWith('http')) {
        try {
          image = new URL(image, origin).href;
        } catch (e) {
          logger.debug('Failed to resolve image URL', {
            url,
            error: e instanceof Error ? e.message : String(e),
          });
          image = '';
        }
      }

      // If still no image, try to find the first large image on the page
      if (!image) {
        const firstImg = $('article img, main img, .content img').first();
        if (firstImg.length) {
          const imgSrc = firstImg.attr('src');
          if (imgSrc) {
            try {
              image = imgSrc.startsWith('http') ? imgSrc : new URL(imgSrc, origin).href;
            } catch (e) {
              image = '';
            }
          }
        }
      }

      const siteName =
        $('meta[property="og:site_name"]').attr('content') ||
        domain;

      const ogType = $('meta[property="og:type"]').attr('content') || '';

      // Determine link type
      const type = this.determineLinkType(url, ogType);

      // Get favicon
      const faviconUrl = this.getFaviconUrl(origin, domain);

      return {
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        url,
        siteName: siteName.trim(),
        domain,
        faviconUrl,
        type,
      };
    } catch (error) {
      if (error instanceof LinkPreviewError) {
        throw error;
      }

      logger.error('Failed to fetch preview', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const origin = urlObj.origin;
        
        // Extract a readable title from URL
        const pathParts = urlObj.pathname.split('/').filter(p => p);
        const lastPart = pathParts[pathParts.length - 1] || domain;
        const title = lastPart
          .replace(/[-_]/g, ' ')
          .replace(/\.(html|htm|php|asp|aspx)$/i, '')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || domain;
        
        // Return fallback data with better title
        return {
          title: title.length > 100 ? domain : title,
          description: `Content from ${domain}`,
          image: '',
          url,
          siteName: domain,
          domain,
          faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
          type: this.determineLinkType(url, ''),
        };
      } catch (e) {
        // If even URL parsing fails, return minimal data
        return {
          title: url,
          description: '',
          image: '',
          url,
          siteName: url,
          domain: url,
          faviconUrl: '',
          type: 'other',
        };
      }
    }
  }

  private determineLinkType(url: string, ogType: string): 'article' | 'video' | 'tool' | 'social' | 'other' {
    const lowerUrl = url.toLowerCase();
    
    // Video platforms
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || 
        lowerUrl.includes('bilibili.com') || ogType.includes('video')) {
      return 'video';
    }
    
    // Social media
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') ||
        lowerUrl.includes('xiaohongshu.com') || lowerUrl.includes('instagram.com') ||
        lowerUrl.includes('facebook.com')) {
      return 'social';
    }
    
    // Tools/Apps (common patterns)
    if (lowerUrl.includes('/tool') || lowerUrl.includes('/app') ||
        lowerUrl.includes('github.com') && lowerUrl.includes('/releases')) {
      return 'tool';
    }
    
    // Articles
    if (ogType.includes('article') || lowerUrl.includes('/blog') || 
        lowerUrl.includes('/article') || lowerUrl.includes('/post')) {
      return 'article';
    }
    
    return 'other';
  }

  private getFaviconUrl(origin: string, domain: string): string {
    // Try multiple favicon sources
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  /**
   * Fetch GitHub repository information using GitHub API
   */
  async fetchGitHubRepo(url: string): Promise<GitHubRepoInfo> {
    // Extract owner and repo from URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }

    const [, owner, repo] = match;
    // Remove .git suffix if present
    const cleanRepo = repo.replace(/\.git$/, '');

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${cleanRepo}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'PersonalOS',
          },
          timeout: 10000,
        }
      );

      const data = response.data;

      return {
        name: data.name,
        description: data.description || '',
        stars: data.stargazers_count,
        language: data.language || '',
        repoUrl: data.html_url,
        demoUrl: data.homepage || '',
        topics: data.topics || [],
      };
    } catch (error) {
      logger.error('Failed to fetch GitHub repository information', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error('Failed to fetch GitHub repository information');
    }
  }

  /**
   * Check if a URL is a GitHub repository URL
   */
  isGitHubUrl(url: string): boolean {
    return /github\.com\/[^\/]+\/[^\/]+/.test(url);
  }
}

// Export singleton instance
export const linkPreviewService = new LinkPreviewService();
