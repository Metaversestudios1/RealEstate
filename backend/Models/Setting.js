const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
    {
        gameStatus: { type: Number,  }, // Active or inactive
        minBetAmount: { type: Number,  },
        maxBetAmount: { type: Number,  },
        initialBonus: { type: Number,  },
        minWithdraw: { type: Number,  },
        minRecharge: { type: Number,  },
        startGameRangeTimer: { type: Number,  }, // Start time of the game range timer
        endGameRangeTimer: { type: Number,  },   // End time of the game range timer
        level1Commission: { type: Number,  },
        level2Commission: { type: Number,  },
        level3Commission: { type: Number,  },
        gameStartTime: { type: Date,  },      // Time when the game starts
        gameBetweenEndTime: { type: Date,  },
    },
    { timestamps: true, collection: "setting" }
);

module.exports = mongoose.model('Setting',settingSchema);
