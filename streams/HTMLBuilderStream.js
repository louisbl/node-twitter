const { Transform } = require('stream')
/**
 * Build the HTML from a tweet to be displayed in the client map
 */
class HTMLBuilderStream extends Transform {
    /**
     * @param {Object} options Options for the stream
     */
    constructor(options) {
        super(options)
    }

    /**
     * @param {String} chunk Chunk
     * @param {String} encoding Encoding
     * @param {Function} callback Callback
     */
    _transform(chunk, encoding, callback) {
        const html = `
            <div class="tweet__header">
            <img class="tweet__header__profile-picture" src="${chunk.profile_picture}"></img>
            <div class="tweet__header__screen-name">${chunk.username}</div>
            <div class="tweet__header__username">@${chunk.name}</div>
            <div class="tweet__header__created-at">${chunk.created_at}</div>
            </div>
            <div class="tweet__content">
                <p>${chunk.text}</p>
            </div>
        `
        const data = {
            text: chunk.text,
            location: chunk.location,
            place: chunk.place,
            html: html,
            query: chunk.query,
            stats: chunk.stats,
            polarity: chunk.polarity
        }
        this.push(data)
        callback()
    }
}

module.exports = HTMLBuilderStream