
// Importing modules && dependencies
const bot = require('../index');
const axios = require('axios');
const ytapi = process.env.YT_API;

// Main funtion that registers all commands
const main = () => {
    try {
        // Youtube search command
        bot.command('ytsearch', async ctx => {
            const input = ctx.message.text;
            const inputArray = input.split(' ');
            if (inputArray.length == 1) {
                ctx.reply("Please mention me what I have to search.");
            } else {
                inputArray.shift();
                const searchContent = inputArray.join(' ');
                const a = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${ytapi}&q=${searchContent}&type=video&part=snippet`);
                const allVids = a.data.items;
                for (vids of allVids) {
                    let vIds = vids.id.videoId;
                    ctx.reply(`https://www.youtube.com/embed/${vIds}`);
                }
            }
        });

        // Youtube latest video details command
        bot.command('ytlatest', async ctx => {
            const input = ctx.message.text;
            const inputArray = input.split(' ');
            if (inputArray.length == 1) {
                ctx.reply('Please mention me a channel id.');
            }else {
                inputArray.shift();
                const channelId = inputArray.join(' ');
                const a = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${ytapi}&channelId=${channelId}&maxResults=5&order=date&part=snippet,id`);
                // Getting Datas
                const videoTitle = a.data.items[0].snippet.title;
                const videoDescriptionRaw = a.data.items[0].snippet.description;
                const videoDescription = `${videoDescriptionRaw.substring(0,201)} ...`;
                const postType = a.data.items[0].id.kind;
                const videoid = a.data.items[0].id.videoId;
                const publishDate = a.data.items[0].snippet.publishTime;

                const message =
                        `<----------------------------- New Post ----------------------------->
Post Type: ${postType}
Title: ${videoTitle}
Description: ${videoDescription}
Video Id: ${videoid}
Publish Date: ${publishDate}`;

                ctx.reply(message, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Watch Video', url: `https://www.youtube.com/embed/${videoid}`}
                            ]
                        ]
                    }
                })
            }
        });

        // Youtube Channel details command
        bot.command('channel', async ctx => {
            const input = ctx.message.text;
            const inputArray = input.split(' ');
            if (inputArray.length == 1) {
                ctx.reply('Please mention me a channel id');
            } else {
                inputArray.shift();
                const channelid = inputArray.join(' ');
                const a = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,status&id=${channelid}&key=${ytapi}`);
                if (a.data.pageInfo.totalResults == 0) {
                    ctx.reply('Please mention a valid channel Id.');
                } else {
                    const channelTitle = a.data.items[0].snippet.title;
                    const channelDescriptionRaw = a.data.items[0].snippet.description;
                    const channelDescription = `${channelDescriptionRaw.substring(0, 15)} ...`;
                    const videoCount = a.data.items[0].statistics.videoCount;
                    const viewCount = a.data.items[0].statistics.viewCount;
                    const subscriberCount = a.data.items[0].statistics.subscriberCount;
                    const publishDate = a.data.items[0].snippet.publishedAt;
                    const privacyStatus = a.data.items[0].status.privacyStatus;
                    let audience;
                    if (a.data.items[0].status.madeForKids) {
                        audience = 'kids';
                    } else {
                        audience = 'adults';
                    }

                    const message =
                        `Channel Name: ${channelTitle}
Channel Description: ${channelDescription}
Uploaded Videos: ${videoCount}
Total Subscribers: ${subscriberCount}
Total Views: ${viewCount}
Privacy Status: ${privacyStatus}
Audience: ${audience}
Publish Date: ${publishDate}`;

                    ctx.reply(message, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {text: `Visit ${channelTitle}` , url: `https://www.youtube.com/channel/${channelid}`}
                                ]
                            ]
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = main;


