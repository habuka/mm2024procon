import P5 from "p5";
import { Player, Ease } from "textalive-app-api";

/* パラメータ関連 */

/**
 * 拡大率の基準とする横幅(px)
 */
const default_width = 1300;


/**
 * 拡大率の基準とする高さ(px)
 */
const default_height = 1000;

/**
 * 文字サイズのデフォルト値
 */
const char_size_default = 40;

/**
 * レコードの中心座標[x, y]
 * キャンバス倍率1の時の値
 */
const record_pos_default = [522, 500];

/**
 * START/STOPボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const startstop_button_pos_default = [42, 871];

/**
 * REPLAYボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const replay_button_pos_default = [42, 778];

/**
 * BACKボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const back_button_pos_default = [27, 698];

/**
 * VOLUMEツマミの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const volume_slider_pos_default = [1189, 733];

/**
 * VOLUMEツマミの上限Y座標[top[px]]
 * キャンバス倍率1の時の値
 * この時に音量が最大になる
 */
const volume_slider_max = 592;

/**
 * VOLUMEツマミの下限Y座標[top[px]]
 * キャンバス倍率1の時の値
 * この時に音量が0になる
 */
const volume_slider_min = 865;

/**
 * 音量の最大値[0-100]
 * 100はデカすぎるので調整。初期値は25
 */
const volume_max = 50;

/**
 * START/STOPボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const startstop_button_size_default = [105, 105];

/**
 * REPLAYボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const replay_button_size_default = [82, 82];

/**
 * BACKボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const back_button_size_default = [66, 66];

/**
 * VOLUMEツマミのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const volume_slider_size_default = [54, 62];

/**
 * 楽曲選択
 * -1: 未選択
 * 0 : king妃jack躍 / 宮守文学 feat. 初音ミク
 * 1 : 生きること / nogumi feat. 初音ミク
 * 2 : 唱明者 / すこやか大聖堂 feat. KAITO
 * 3 : ネオンライトの海を往く / Ponchi♪ feat. 初音ミク
 * 4 : ミュウテイション / Rin（Kuroneko Lounge） feat. 初音ミク
 * 5 : Entrust via 39 / ikomai feat. 初音ミク
 */
let song_id = -1;

/**
 * アプリ全体の拡大率
 */
let genaral_magnification = 0;

/**
 * VOLUMEツマミの位置[left, top[px]]
 */
let volume_slider_pos = [];

/**
 * 回転角度リストの要素数
 * 最初に0、最後に楽曲の終端を格納するので要素数は歌詞の文字数 + 2
 */
let char_list_size = 0;

/**
 * 再生モードの定義
 * 0: 停止
 * 1: 再生
 * 2: 停止中皿回し
 * 3: 再生中皿回し
 */
let play_mode = 0;

/**
 * VOLUMEツマミモードの定義
 * 0: 操作中でない
 * 1: 操作中
 */
let vol_slider_mode = 0;

/**
 * 直前の皿回し処理におけるポインター位置のディスク上の見かけの角度[deg]
 */
let previous_pointer_angle = 0;

/**
 * 直前のVOLUMEツマミ操作におけるポインター位置のy座標
 */
let previous_pointer_volume_y = 0;

/**
 * 歌詞を表示するキャンバスの回転角度[deg]
 */
let angle_canvas = 0;

/**
 * レコードの回転角度[deg]
 */
let angle_disc = 0;

let char_list = {};

let lf_cycle = 2;

let lf_time_list = [];
let line_num = 0;
let current_line_num = 0;

let max_text_in_line = 25;

/* プレイヤーの初期化 / Initialize TextAlive Player */
const player = new Player({
  /* トークンは https://developer.textalive.jp/profile で取得したものを使う */
  app: { token: "xsnERhRnjyZIGziY" },
});

/* リスナの登録 / Register listeners */
player.addListener({
  onAppReady: () => {
    console.log("onAppReady");
  },

  onTextLoad: (body) => {
    /* Webフォントを確実に読み込むためDOM要素に歌詞を貼り付ける */
    console.log("player.onTextLoad");
    document.querySelector("#dummy").textContent = body?.text;
  },

  onVideoReady: () => {
    console.log("player.onVideoReady");
    CreatePositionList();
  },

  onTimerReady: () => {
    /* このイベントハンドラが呼ばれたらプレイヤー準備完了なので画面を切り返る */
    console.log("player.onTimerReady");
    document.getElementById('loading').style.display = "none";
    document.getElementById('song_select').style.display = "none";
    document.getElementById('startstop').style.display = "block";
    document.getElementById('replay').style.display = "block";
    document.getElementById('back').style.display = "block";
    document.getElementById('p5js').style.display = "flex";
  },

  onPlay: () => {
    console.log("player.onPlay");
  },

  onPause: () => {
    console.log("player.onPause");
  },

  onSeek: () => {
    console.log("player.onSeek");
  },

  onStop: () => {
    console.log("player.onStop");
  },
});

/* 楽曲選択ボタン */
document.querySelector("#song_0").addEventListener("click", () => {
  StartPlayer(0);
});

document.querySelector("#song_1").addEventListener("click", () => {
  StartPlayer(1);
});

document.querySelector("#song_2").addEventListener("click", () => {
  StartPlayer(2);
});

document.querySelector("#song_3").addEventListener("click", () => {
  StartPlayer(3);
});

document.querySelector("#song_4").addEventListener("click", () => {
  StartPlayer(4);
});

document.querySelector("#song_5").addEventListener("click", () => {
  StartPlayer(5);
});

/**
 * @fn InitPlayer
 * @brief プレイヤー関連のパラメータを初期化する(楽曲再選択時等に必要)
 */
const InitPlayer = () => {
  song_id = -1;
  char_list_size = 0;
  play_mode = 0;
  previous_pointer_angle = 0;
  angle_canvas = 0;
  angle_disc = 0;
}

/**
 * @fn StartPlayer
 * @brief 楽曲IDを指定してプレイヤーを表示する
 * @param[in] song_id: 楽曲ID
 */
const StartPlayer = (song_id) => {
  InitPlayer();
  switch (song_id) {
  case 0:
    // SUPERHERO / めろくる
    player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592293,
        chordId: 2727635,
        repetitiveSegmentId: 2824326,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
        lyricId: 59415,
        lyricDiffId: 13962
      },
    });
    break;
  case 1:
    // いつか君と話したミライは / タケノコ少年
    player.createFromSongUrl("https://piapro.jp/t/--OD/20240202150903", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592296,
        chordId: 2727636,
        repetitiveSegmentId: 2824327,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2F--OD%2F20240202150903
        lyricId: 59416,
        lyricDiffId: 13963
      },
    });
    break;
  case 2:
    // フューチャーノーツ / shikisai
    player.createFromSongUrl("https://piapro.jp/t/XiaI/20240201203346", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592297,
        chordId: 2727637,
        repetitiveSegmentId: 2824328,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FXiaI%2F20240201203346
        lyricId: 59417,
        lyricDiffId: 13964
      },
    });
    break;
  case 3:
    // 未来交響曲 / ヤマギシコージ
    player.createFromSongUrl("https://piapro.jp/t/Rejk/20240202164429", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592298,
        chordId: 2727638,
        repetitiveSegmentId: 2824329,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRejk%2F20240202164429
        lyricId: 59418,
        lyricDiffId: 13965
      },
    });
    break;
  case 4:
    // リアリティ / 歩く人
    player.createFromSongUrl("https://piapro.jp/t/ELIC/20240130010349", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592299,
        chordId: 2727639,
        repetitiveSegmentId: 2824330,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FELIC%2F20240130010349
        lyricId: 59419,
        lyricDiffId: 13966
      },
    });
    break;
  case 5:
    // The Marks / 2ouDNS
    player.createFromSongUrl("https://piapro.jp/t/xEA7/20240202002556", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592300,
        chordId: 2727640,
        repetitiveSegmentId: 2824331,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FxEA7%2F20240202002556
        lyricId: 59420,
        lyricDiffId: 13967
      },
    });
    break;
  default:
    break;
  }
  document.getElementById('song_select').style.display = "none";
  document.getElementById('loading').style.display = "flex";
}

/* START/STOPボタン */
document.querySelector("#startstop").addEventListener("click", () => {
  switch (play_mode) {
  case 0:
    /* そのまま再生するとPositionが変な値になっていることがあるので現在の再生時間に明示的にシークしてから再生開始 */
    player.requestPlay();
    play_mode = 1;
    break;
  case 1:
    player.requestPause();
    play_mode = 0;
    break;
  default:
    break;
  }
});

/* REPLAYボタン */
document.querySelector("#replay").addEventListener("click", () => {
  if (play_mode <= 1) {
    /* 皿回し中は無効 */
    player.requestPause();
    play_mode = 0;
    angle_canvas = 0;
    player.requestMediaSeek(0);
  }
});

/* BACKボタン */
document.querySelector("#back").addEventListener("click", () => {
  player.requestStop();
  document.getElementById('p5js').style.display = "none";
  document.getElementById('startstop').style.display = "none";
  document.getElementById('replay').style.display = "none";
  document.getElementById('back').style.display = "none";
  document.getElementById('song_select').style.display = "flex";
});

/* 皿回し開始処理 */
/* マウス操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("mousedown", (e) => {
  mousedown(e);
});

/* タッチ操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("touchstart", (e) => {
  mousedown(e.changedTouches[0]);
});

/* 共通処理 */
const mousedown = (e) => {
  ;
}

/* 皿回し回転処理 */
/* マウス操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("mousemove", (e) => {
  mousemove(e);
});

/* タッチ操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("touchmove", (e) => {
  mousemove(e.changedTouches[0]);
});

/* 共通処理 */
const mousemove = (e) => {
  if (vol_slider_mode == 1) {
    ChangeVolume(e.pageY);
  }
}

const ChangeVolume = (y) => {
  let y_dif = (y - previous_pointer_volume_y) / genaral_magnification;
  if ((volume_slider_pos[1] + y_dif) > volume_slider_min) {
    volume_slider_pos[1] = volume_slider_min;
  } else if ((volume_slider_pos[1] + y_dif) < volume_slider_max) {
    volume_slider_pos[1] = volume_slider_max;
  } else {
    volume_slider_pos[1] += y_dif;
  }
  previous_pointer_volume_y = y;
  document.getElementById("volume_slider").style.top = (volume_slider_pos[1] * genaral_magnification) + 'px';
  player.volume = (volume_slider_min - volume_slider_pos[1]) / (volume_slider_min - volume_slider_max) * volume_max;
}

/* 皿回し終了処理 */
/* マウス操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("mouseup", (e) => {
  mouseup(e);
});

/* マウス操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("mouseleave", (e) => {
  mouseup(e);
});

/* タッチ操作用イベントハンドラ */
document.querySelector("#p5js").addEventListener("touchend", (e) => {
  mouseup(e.changedTouches[0]);
});

/* 共通処理 */
const mouseup = (e) => {
  if (vol_slider_mode == 1) {
    vol_slider_mode = 0;
    document.getElementById('volume_slider').style.display = "block";
  }
}

/* VOLUMEツマミ処理 */
/* マウス操作用イベントハンドラ */
document.querySelector("#volume_slider").addEventListener("mousedown", (e) => {
  mousedown_vol(e);
});

/* タッチ操作用イベントハンドラ */
document.querySelector("#volume_slider").addEventListener("touchstart", (e) => {
  mousedown_vol(e.changedTouches[0]);
});

/* 共通処理 */
const mousedown_vol = (e) => {
  vol_slider_mode = 1;
  previous_pointer_volume_y = e.pageY;
  document.getElementById('volume_slider').style.display = "none";
}

/* p5.js を初期化 */
new P5((p5) => {
  /* キャンバスの大きさなどを計算 */
  const width = default_width;
  const height = default_height;
  const margin = 30;
  const textAreaWidth = width - margin * 2;
  const frame_rate = 30;

  p5.preload = () => {
    /* 画像を読み込む */
    img_background = p5.loadImage("../img/background.png"); /* 背景 */
    img_startstop_play = p5.loadImage("../img/button_startstop_play.png"); /* START/STOPボタン(再生中) */
    img_startstop_stop = p5.loadImage("../img/button_startstop_stop.png"); /* START/STOPボタン(停止中) */
    img_replay_play = p5.loadImage("../img/button_replay_play.png"); /* REPLAYボタン(再生中) */
    img_replay_stop = p5.loadImage("../img/button_replay_stop.png"); /* REPLAYボタン(停止中) */
    img_back = p5.loadImage("../img/button_back.png"); /* BACKボタン */
    img_volume_slider = p5.loadImage("../img/volume_slider.png"); /* VOLUMEツマミ */
  };

  /* キャンバスを作成 */
  p5.setup = () => {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.getElementById('p5js'));
    player.volume = 25;
    volume_slider_pos[0] = volume_slider_pos_default[0];
    volume_slider_pos[1] = volume_slider_pos_default[1];
    previous_pointer_volume_y = volume_slider_pos_default[1];
    p5.ResizeWindow();
    p5.translate(width / 2, height / 2);
    p5.colorMode(p5.HSB, 100);
    p5.angleMode(p5.DEGREES);
    p5.frameRate(frame_rate);
    p5.background(40);
    p5.noStroke();
    p5.textFont("DotGothic16");
    p5.textAlign(p5.CENTER, p5.CENTER);

    /* キャンバス作成時には楽曲選択画面 */
    document.getElementById('loading').style.display = "none";
    document.getElementById('p5js').style.display = "none";
    document.getElementById('startstop').style.display = "none";
    document.getElementById('replay').style.display = "none";
    document.getElementById('back').style.display = "none";
  };

  /* ビートにあわせて背景を、発声にあわせて歌詞を表示 */
  p5.draw = () => {
    /* プレイヤーが準備できていなかったら何もしない */
    if (!player || !player.video) {
      return;
    }
    /* 現在の再生位置 */
    const position = player.timer.position;

    /* 再生開始直後に再生位置が不正な場合があるので弾く */
    if (position > player.video.duration) {
      return;
    }

    /* 再生中に楽曲の終端に到達した場合、停止して待機 */
    if ((position == player.video.duration) &&
        (play_mode == 1)) {
      play_mode = 0;
    }

    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    p5.scale(genaral_magnification);

    /* 筐体 */
    p5.imageMode(p5.CORNER);
    p5.image(img_background, 0, 0);

    /* VOLUMEツマミ */
    p5.image(img_volume_slider, volume_slider_pos[0], volume_slider_pos[1]);

    /* 歌詞の描画 */
    p5.push();

    /* 文字の描画 */
    let char = player.video.findChar(position - 100, { loose: true });
    let beat = player.findBeat(position);

    /* 次の発声文字から歌詞インデックスを取得 */
    let next_char = p5.GetNextChar(position);

    if (next_char != null) {
      char_index = player.video.findIndex(next_char);
    }

    if (lf_time_list[current_line_num + 1] <= position) {
      current_line_num++;
    }

    // if (lf_time_list[current_line_num + 1] - 100 <= position) {

    // }

    for (let i = 0; i < char_list_size - 2; i++) {
      if (char_list[i].line <= current_line_num + 1) {
        const x = (char_list[i].pos + 0.5) * (textAreaWidth / max_text_in_line);
        let transparency = 1;
        let y = - (current_line_num - char_list[i].line) * 30;
        let size = 39;

        // 100 [ms] かけてフェードインしてくる
        if (position < char_list[i].start_time) {
          const progress = 1 - (char_list[i].start_time - position) / 100;
          const eased = Ease.circIn(progress);
          transparency = progress;
          size = 39 * eased + Math.min(width, height) * (1 - eased);
        }
        // // 160 [ms] かけてフェードアウトする
        // else if (char.endTime < position) {
        //   const progress = (position - char.endTime) / 160;
        //   const eased = Ease.quintIn(progress);
        //   transparency = 1 - eased;
        // }
        // // 発声区間中は完全に不透明
        // else {
        //   transparency = 1;
        // }

        p5.fill(0, 0, 100, transparency * 100);
        p5.textSize(size);
        p5.text(char_list[i].char, margin + x, height / 2 + y);
      }
    }

    // if (char) {
    //   while (char) {
    //     /* リスト参照のため歌詞インデックスを取得 */
    //     let index = player.video.findIndex(char);

    //     // if (char_list[index].start_time + 160 < position) {
    //     //   // これ以降の文字は表示する必要がない
    //     //   break;
    //     // }
    //     const x = (char_list[index].pos + 0.5) * (textAreaWidth / numChars);
    //     let transparency = 1;
    //     let y = (current_line_num - char_list[index].line) * 100;
    //     let size = 39;

    //     // 100 [ms] かけてフェードインしてくる
    //     if (position < char.startTime) {
    //       const progress = 1 - (char.startTime - position) / 100;
    //       const eased = Ease.circIn(progress);
    //       transparency = progress;
    //       size = 39 * eased + Math.min(width, height) * (1 - eased);
    //     }
    //     // // 160 [ms] かけてフェードアウトする
    //     // else if (char.endTime < position) {
    //     //   const progress = (position - char.endTime) / 160;
    //     //   const eased = Ease.quintIn(progress);
    //     //   transparency = 1 - eased;
    //     // }
    //     // // 発声区間中は完全に不透明
    //     // else {
    //     //   transparency = 1;
    //     // }

    //     p5.fill(0, 0, 100, transparency * 100);
    //     p5.textSize(size);
    //     p5.text(char.text, margin + x, height / 2 + y);

    //     char = char.next;
    //     index++;
    //   }
    // }

    /* ボタンの描画 */
    p5.image(img_back, 0, 0);
    /* 再生中 or 停止中でライトの色を切り替える */
    if ((play_mode == 1) ||
        (play_mode == 3)) {
      p5.image(img_startstop_play, 0, 0);
      p5.image(img_replay_play, 0, 0);
    } else {
      p5.image(img_startstop_stop, 0, 0);
      p5.image(img_replay_stop, 0, 0);
    }
  };

  p5.windowResized = () => {
    p5.ResizeWindow();
  };

/**
 * @fn GetNextChar
 * @brief 入力時刻における次の発声文字を取得する
 * @param[in] position: 検索したい時刻
 * @return 次の発声文字
 * @detail 発声中の場合、現在発声中の次の文字を返す
 */
  p5.GetNextChar = (position) => {
    let next_char = player.video.findChar(position, { loose: true });
    if (player.video.findChar(position, { loose: false }) != null) {
      /* 発声中の場合、現在発声中の次の文字 */
      next_char = next_char.next;
    }
    return next_char;
  };

/**
 * @fn ResizeWindow
 * @brief 全体をウインドウサイズに合わせる
 */
  p5.ResizeWindow = () => {
    /* 現在のウインドウサイズを取得 */
    let width = window.innerWidth;
    let height = window.innerHeight;

    /* 短い方に合わせてデフォルトサイズに対する拡大率を決める */
    let magnification_width = width / default_width;
    let magnification_height = height / default_height;

    if (magnification_width < magnification_height) {
      genaral_magnification = magnification_width;
    } else {
      genaral_magnification = magnification_height;
    }
    startstop_button = document.getElementById("startstop");
    startstop_button.style.width = (startstop_button_size_default[0] * genaral_magnification) + 'px';
    startstop_button.style.height = (startstop_button_size_default[1] * genaral_magnification) + 'px';
    startstop_button.style.left = (startstop_button_pos_default[0] * genaral_magnification) + 'px';
    startstop_button.style.top = (startstop_button_pos_default[1] * genaral_magnification) + 'px';

    replay_button = document.getElementById("replay");
    replay_button.style.width = (replay_button_size_default[0] * genaral_magnification) + 'px';
    replay_button.style.height = (replay_button_size_default[1] * genaral_magnification) + 'px';
    replay_button.style.left = (replay_button_pos_default[0] * genaral_magnification) + 'px';
    replay_button.style.top = (replay_button_pos_default[1] * genaral_magnification) + 'px';

    back_button = document.getElementById("back");
    back_button.style.width = (back_button_size_default[0] * genaral_magnification) + 'px';
    back_button.style.height = (back_button_size_default[1] * genaral_magnification) + 'px';
    back_button.style.left = (back_button_pos_default[0] * genaral_magnification) + 'px';
    back_button.style.top = (back_button_pos_default[1] * genaral_magnification) + 'px';

    volume_slider = document.getElementById("volume_slider");
    volume_slider.style.width = (volume_slider_size_default[0] * genaral_magnification) + 'px';
    volume_slider.style.height = (volume_slider_size_default[1] * genaral_magnification) + 'px';
    volume_slider.style.left = (volume_slider_pos[0] * genaral_magnification) + 'px';
    volume_slider.style.top = (volume_slider_pos[1] * genaral_magnification) + 'px';
  };
});

/**
 * @fn CreatePositionList
 * @brief 歌詞の配置リストを作成する
 */
const CreatePositionList = () => {
  let pos_in_line = 0;
  let beat_cycle = 0;
  let beat;
  let previous_beat;

  let char = player.video.findChar(0, {loose: true}); /* 最初の発声文字 */
  while(char != null) {
    beat = player.findBeat(char.startTime);

    if (previous_beat > beat.position) {
      beat_cycle++;
      if (beat_cycle >= lf_cycle) {
        lf_time_list[line_num] = char.startTime;
        line_num++;
        pos_in_line = 0;
        beat_cycle = 0;
      }
    } else {
      if (pos_in_line >= max_text_in_line) {
        lf_time_list[line_num] = char.startTime;
        line_num++;
        pos_in_line = 0;
      }
    }
    char_list[char_list_size] = {char:char.text, start_time:char.startTime,
                                 line:line_num, pos:pos_in_line};

    char = char.next
    previous_beat = beat.position;
    pos_in_line++;
    char_list_size++;
  }

  console.log(char_list);
  console.log(lf_time_list);

  char_list_size++;
}

/**
 * @fn Deg2Rad
 * @brief Deg -> Radの変換を行う
 * @param[in] deg: 角度[deg]
 * @return 角度[rad]
 */
const Deg2Rad = (deg) => {
  let rad = deg / 180 * Math.PI;
  return rad;
}

/**
 * @fn Rad2Deg
 * @brief Rad -> Degの変換を行う
 * @param[in] rad: 角度[rad]
 * @return 角度[deg]
 */
const Rad2Deg = (rad) => {
  let deg = rad / Math.PI * 180;
  return deg;
}
