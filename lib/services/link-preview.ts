import axios from 'axios';
import * as cheerio from 'cheerio';

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
  /**
   * Fetch preview information from a URL using Open Graph tags
   */
  async fetchPreview(url: string): Promise<LinkPreview> {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const origin = urlObj.origin;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PersonalOS/1.0)',
        },
        timeout: 10000,
        maxRedirects: 5,
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
          console.error('Failed to resolve image URL:', e);
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
      console.error('Failed to fetch preview:', error);
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
      console.error('Failed to fetch GitHub repo:', error);
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
