module.exports = async function() {
  try {
    const channelId = "UCv8bKw-zcsZSVlVN3cFCBUQ";
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    
    // Node.js v18+ has a native global fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube feed: ${response.statusText}`);
    }
    const xml = await response.text();
    
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [];
    let match;
    
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      
      const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
      const linkMatch = entryXml.match(/<link[^>]+href="([^"]+)"/);
      const thumbnailMatch = entryXml.match(/<media:thumbnail[^>]+url="([^"]+)"/);
      const viewsMatch = entryXml.match(/<media:statistics[^>]+views="([^"]+)"/);
      const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
      
      if (videoIdMatch && titleMatch) {
        const videoId = videoIdMatch[1];
        let title = titleMatch[1];
        
        // Clean up entities in title
        title = title
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        const link = linkMatch ? linkMatch[1] : `https://www.youtube.com/watch?v=${videoId}`;
        const thumbnail = thumbnailMatch ? thumbnailMatch[1] : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const viewsCount = viewsMatch ? parseInt(viewsMatch[1], 10) : 0;
        const published = publishedMatch ? publishedMatch[1] : "";
        
        // Format views
        let views = "0 views";
        if (viewsCount >= 1000000) {
          views = `${(viewsCount / 1000000).toFixed(1).replace(/\.0$/, "")}m views`;
        } else if (viewsCount >= 1000) {
          views = `${(viewsCount / 1000).toFixed(1).replace(/\.0$/, "")}k views`;
        } else {
          views = `${viewsCount} views`;
        }
        
        // Calculate relative date
        let dateStr = "recently";
        if (published) {
          const pubDate = new Date(published);
          const diffMs = new Date() - pubDate;
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays === 0) {
            dateStr = "today";
          } else if (diffDays === 1) {
            dateStr = "yesterday";
          } else if (diffDays < 7) {
            dateStr = `${diffDays} days ago`;
          } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            dateStr = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
          } else {
            const months = Math.floor(diffDays / 30);
            dateStr = `${months} month${months > 1 ? "s" : ""} ago`;
          }
        }

        // Detect if it's a short
        const isShort = link.includes("/shorts/") || 
                        title.toLowerCase().includes("#shorts") || 
                        title.toLowerCase().includes("#short") ||
                        title.toLowerCase().includes("#gdshorts");
        
        entries.push({
          id: videoId,
          title: title,
          url: link,
          type: isShort ? "short" : "video",
          views: views,
          date: dateStr,
          thumbnail: thumbnail
        });
      }
    }
    
    // Duplicate the entries 5 times to create a large dataset for infinite scrolling
    const replicatedEntries = [];
    for (let i = 0; i < 5; i++) {
      entries.forEach((entry) => {
        replicatedEntries.push({
          ...entry,
          uniqId: `${entry.id}-${i}`,
          title: i === 0 ? entry.title : `${entry.title} part ${i + 1}`
        });
      });
    }
    
    return replicatedEntries;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    // Fallback static data if fetch fails
    const fallback = [
      {
        "id": "6V4ZnDmXJZ0",
        "title": "dying before the best part be like #gd #gmd #geometrydash",
        "url": "https://www.youtube.com/shorts/6V4ZnDmXJZ0",
        "type": "short",
        "views": "422 views",
        "date": "today",
        "thumbnail": "https://i.ytimg.com/vi/6V4ZnDmXJZ0/hqdefault.jpg"
      },
      {
        "id": "dQw4w9WgXcQ",
        "title": "beating eon: 100% run",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "type": "video",
        "views": "154k views",
        "date": "2 weeks ago",
        "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
      }
    ];

    const replicatedFallback = [];
    for (let i = 0; i < 15; i++) {
      fallback.forEach((entry) => {
        replicatedFallback.push({
          ...entry,
          uniqId: `${entry.id}-${i}`,
          title: i === 0 ? entry.title : `${entry.title} part ${i + 1}`
        });
      });
    }
    return replicatedFallback;
  }
};
