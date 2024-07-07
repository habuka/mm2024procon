import P5 from "p5";
import { Player, Ease } from "textalive-app-api";

/* パラメータ関連 */

/**
 * 拡大率の基準とする横幅(px)
 */
const default_width = 1600;

/**
 * 拡大率の基準とする高さ(px)
 */
const default_height = 1440;

/**
 * 文字サイズのデフォルト値
 */
const char_size_default = 60;

/**
 * ミクさんの1ドット辺りの長さ(px)
 */
const miku_dot_size = 15;

/**
 * 文字表示領域のy座標
 */
const char_height_default = 500;

/**
 * ミクの基準位置(中央揃え)[left, top[px]]
 * キャンバス倍率1の時の値
 */
const miku_pos_default = [800, 650];

/**
 * ダンスアニメーション用基準位置オフセットテーブル(中央揃え)[left, top[px]]
 * キャンバス倍率1の時の値
 */
const miku_pos_offset_table = [
  [0, 0],
  [-30, -30],
  [0, 0],
  [30, -30],
]

/**
 * 音符エフェクトテーブル[left, top[px]]
 * キャンバス倍率1の時の値
 */
const effect_note_pos_table = [
  [[350, 400], [420, 280]],
  [[800, 150], [860, 160]],
  [[1200, 550], [1150, 500]],
]

/**
 * ▼アイコンの位置
 * キャンバス倍率1の時の値
 */
const icon_scrill_pos = [1420, 1277];

/**
 * START/STOPボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const startstop_button_pos_default = [0, 790];

/**
 * BACKボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const back_button_pos_default = [0, 0];

/**
 * 音符ボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const note_button_pos_default = [1360, 0];

/**
 * 楽曲選択画面のテキスト位置[center, center[px]]
 * キャンバス倍率1の時の値
 */
const song_select_text_pos = [800, 1210];

/**
 * 楽曲選択画面のテキスト(選択前、選択後)
 */
const song_select_text = [
  "きょくを　えらんでね",
  "よみこみちゅう……"
];

/**
 * 楽曲選択ボタンの位置[left, top[px]]
 * キャンバス倍率1の時の値
 */
const song_button_pos_default = [
  [37, 45], [820, 45],
  [37, 375], [820, 375],
  [37, 695], [820, 695],
];

/**
 * 楽曲選択ボタン用の情報
 */
const song_info = [
  ["SUPERHERO", "めろくる"], ["いつか君と話したミライは", "タケノコ少年"],
  ["フューチャーノーツ", "shikisai"], ["未来交響曲", "ヤマギシコージ"],
  ["リアリティ", "歩く人 & sober bear"], ["The Marks", "2ouDNS"],
];

/**
 * 楽曲ごとの強制改行位置テーブル(文章の切れ目などをいい感じにする)
 */
/**
 * SUPERHERO
 */
const manual_lf_list_song0 = [
  18, 30, 41, 54, 67, 82,
  105, 123, 140, 158, 166,
  183, 190, 206, 215, 223, 232,
  246, 264, 276, 287, 300, 313, 328,
  351, 371, 378, 403, 409, 429, 454, 466, 481,
  501, 519, 535, 546,
  557, 589, 621, 632,
  650, 659, 671, 679, 687, 696,
  710, 728, 739, 750, 762, 777, 792,
  815, 828, 843, 857, 876,
  890, 908, 920, 931, 944, 957, 972,
  995, 1015, 1022, 1047, 1053, 1073, 1098, 1110, 1125,
];

/**
 * いつか君と話したミライは
 */
const manual_lf_list_song1 = [
  12, 24, 41,
  51, 64,
  71, 88, 104, 122, 134,
  146, 159, 173, 193,
  203, 221, 238,
  253, 265, 278,
  287, 303, 314, 332, 344,
];

/**
 * フューチャーノーツ
 */
const manual_lf_list_song2 = [
  7, 20, 27,
  33, 37, 49, 55, 59, 69,
  77, 86,
  93,
  105, 114, 120, 129, 137, 143, 151,
  160, 172, 185, 191, 197,
  209, 217, 228, 234, 240,
  253, 262, 268, 277, 280, 290,
  303, 309, 320, 332, 341, 349, 355, 361,
  370, 379,
];

/**
 * 未来交響曲
 */
const manual_lf_list_song3 = [
  15, 30, 44,
  58, 76, 83, 92, 98,
  105, 115, 134, 152, 166,
  181, 190, 204, 220, 230, 247,
  253, 267,
  284, 296, 312, 320, 331,
  336, 349, 361, 379, 397, 409,
  428, 439, 454, 480, 490, 498, 515,
];

/**
 * リアリティ
 */
const manual_lf_list_song4 = [
  9, 23, 30,
  48, 63, 69,
  82, 92, 114, 130,
  144, 153, 167, 177,
  193, 207, 217,
  230, 240, 259, 274,
  287, 302, 312,
  323, 333, 354, 373, 383, 393, 409, 422,
];

/**
 * The Marks
 */
const manual_lf_list_song5 = [
  16, 35,
  39, 45, 51, 62, 73, 81, 88, 95, 105, 115,
  123, 132, 145, 156,
  164,
  168, 174, 180, 190, 200, 206, 214, 222, 233, 243,
  255,
  268, 274,
  280, 286, 292, 303, 314, 322, 329, 336, 348, 358,
  366,
];

/**
 * START/STOPボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const startstop_button_size_default = [240, 240];

/**
 * BACKボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const back_button_size_default = [240, 240];

/**
 * 音符ボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const note_button_size_default = [240, 240];

/**
 * 楽曲選択ボタンのサイズ[width, height[px]]
 * キャンバス倍率1の時の値
 */
const song_button_size_default = [750, 280];

/**
 * 楽曲選択
 * -1: 未選択
 * 0 : SUPERHERO / めろくる
 * 1 : いつか君と話したミライは / タケノコ少年
 * 2 : フューチャーノーツ / shikisai
 * 3 : 未来交響曲 / ヤマギシコージ
 * 4 : リアリティ / 歩く人 & sober bear
 * 5 : The Marks / 2ouDNS
 */
let song_id = -1;

/**
 * アプリ全体の拡大率
 */
let general_magnification = 0;

/**
 * 回転角度リストの要素数
 * 最初に0、最後に楽曲の終端を格納するので要素数は歌詞の文字数 + 2
 */
let char_list_size = 0;

/**
 * シーンの定義
 * 0: 楽曲選択
 * 1: プレイヤー
 */
let scene = 0;

/**
 * 再生モードの定義
 * 0: 停止
 * 1: 再生
 */
let play_mode = 0;

/**
 * 楽曲選択画面のテキスト
 * 0: 選択前
 * 1: 選択後
 */
let song_select_mode = 0;

/**
 * 再生中のダンスのモーション管理
 */
let animation_pose_index = 0;

/**
 * 再生中のダンスのオフセット管理
 */
let animation_offset_index = 0;

/**
 * 再生中の音符エフェクト管理
 */
let animation_note_index = 0;

/**
 * 再生中の▼アイコン管理
 */
let animation_icon_scroll = 0;

let previous_beat = null;

/**
 * 楽曲選択ボタン押下アニメーション管理
 */
let song_button_pushed = [0, 0, 0, 0, 0, 0];

/**
 * 音符演出ON/OFFフラグ(0 or 1)
 */
let effect_note = 0;

/**
 * 歌詞ごとの制御情報のリスト
 */
let char_list = {};

/**
 * 改行タイミングのリスト
 */
let lf_time_list = [];

/**
 * 現在の行番号
 */
let line_num = 0;

/**
 * 改行タイミングのリスト
 */
let current_line_num = 0;

/**
 * 1行の最大文字数
 * この文字数を超える場合は自動的に改行される
 */
let max_text_in_line = 25;

/* プレイヤーの初期化 / Initialize TextAlive Player */
const player = new Player({
  /* トークンは https://developer.textalive.jp/profile で取得したものを使う */
  app: { token: "ob2pOUlQUyANEgfv" },
});

/* リスナの登録 / Register listeners */
player.addListener({
  onAppReady: () => {
    console.log("onAppReady");
    SetSceneSongSelect();
  },

  onTextLoad: (body) => {
    /* Webフォントを確実に読み込むためDOM要素に歌詞を貼り付ける */
    console.log("player.onTextLoad");
    document.querySelector("#dummy").textContent = body?.text;
  },

  onVideoReady: () => {
    console.log("player.onVideoReady");
    CreatePositionList(song_id);
  },

  onTimerReady: () => {
    /* このイベントハンドラが呼ばれたらプレイヤー準備完了なので画面を切り返る */
    console.log("player.onTimerReady");
    SetScenePlayer();
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

/* 楽曲選択ボタン押下用アニメーション */
document.querySelector("#song_0").addEventListener("mousedown", (e) => {
  SongButtonPush(e, 0, 1);
});
document.querySelector("#song_0").addEventListener("touchstart", (e) => {
  SongButtonPush(e.changedTouches[0], 0, 1);
});
document.querySelector("#song_0").addEventListener("mouseup", (e) => {
  SongButtonPush(e, 0, 0);
});
document.querySelector("#song_0").addEventListener("mouseleave", (e) => {
  SongButtonPush(e, 0, 0);
});
document.querySelector("#song_0").addEventListener("touchend", (e) => {
  SongButtonPush(e.changedTouches[0], 0, 0);
});

document.querySelector("#song_1").addEventListener("mousedown", (e) => {
  SongButtonPush(e, 1, 1);
});
document.querySelector("#song_1").addEventListener("touchstart", (e) => {
  SongButtonPush(e.changedTouches[0], 1, 1);
});
document.querySelector("#song_1").addEventListener("mouseup", (e) => {
  SongButtonPush(e, 1, 0);
});
document.querySelector("#song_1").addEventListener("mouseleave", (e) => {
  SongButtonPush(e, 1, 0);
});
document.querySelector("#song_1").addEventListener("touchend", (e) => {
  SongButtonPush(e.changedTouches[0], 1, 0);
});

document.querySelector("#song_2").addEventListener("mousedown", (e) => {
  SongButtonPush(e, 2, 1);
});
document.querySelector("#song_2").addEventListener("touchstart", (e) => {
  SongButtonPush(e.changedTouches[0], 2, 1);
});
document.querySelector("#song_2").addEventListener("mouseup", (e) => {
  SongButtonPush(e, 2, 0);
});
document.querySelector("#song_2").addEventListener("mouseleave", (e) => {
  SongButtonPush(e, 2, 0);
});
document.querySelector("#song_2").addEventListener("touchend", (e) => {
  SongButtonPush(e.changedTouches[0], 2, 0);
});

document.querySelector("#song_3").addEventListener("mousedown", (e) => {
  SongButtonPush(e, 3, 1);
});
document.querySelector("#song_3").addEventListener("touchstart", (e) => {
  SongButtonPush(e.changedTouches[0], 3, 1);
});
document.querySelector("#song_3").addEventListener("mouseup", (e) => {
  SongButtonPush(e, 3, 0);
});
document.querySelector("#song_3").addEventListener("mouseleave", (e) => {
  SongButtonPush(e, 3, 0);
});
document.querySelector("#song_3").addEventListener("touchend", (e) => {
  SongButtonPush(e.changedTouches[0], 3, 0);
});

document.querySelector("#song_4").addEventListener("mousedown", (e) => {
  SongButtonPush(e, 4, 1);
});
document.querySelector("#song_4").addEventListener("touchstart", (e) => {
  SongButtonPush(e.changedTouches[0], 4, 1);
});
document.querySelector("#song_4").addEventListener("mouseup", (e) => {
  SongButtonPush(e, 4, 0);
});
document.querySelector("#song_4").addEventListener("mouseleave", (e) => {
  SongButtonPush(e, 4, 0);
});
document.querySelector("#song_4").addEventListener("touchend", (e) => {
  SongButtonPush(e.changedTouches[0], 4, 0);
});

document.querySelector("#song_5").addEventListener("mousedown", (e) => {
  SongButtonPush(e, 5, 1);
});
document.querySelector("#song_5").addEventListener("touchstart", (e) => {
  SongButtonPush(e.changedTouches[0], 5, 1);
});
document.querySelector("#song_5").addEventListener("mouseup", (e) => {
  SongButtonPush(e, 5, 0);
});
document.querySelector("#song_5").addEventListener("mouseleave", (e) => {
  SongButtonPush(e, 5, 0);
});
document.querySelector("#song_5").addEventListener("touchend", (e) => {
  SongButtonPush(e.changedTouches[0], 5, 0);
});

/* 共通処理 */
const SongButtonPush = (e, button, push) => {
  song_button_pushed[button] = push;
}

/**
 * @fn InitPlayer
 * @brief プレイヤー関連のパラメータを初期化する(楽曲再選択時等に必要)
 */
const InitPlayer = () => {
  song_id = -1;
  play_mode = 0;
  animation_pose_index = 0;
  animation_offset_index = 0;
  animation_note_index = 0;
  previous_beat = null;
  effect_note = 0;
}

/**
 * @fn StartPlayer
 * @brief 楽曲IDを指定してプレイヤーを表示する
 * @param[in] song_id: 楽曲ID
 */
const StartPlayer = (id) => {
  InitPlayer();
  song_id = id;
  song_select_mode = 1;
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
    // リアリティ / 歩く人 & sober bear
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

/* BACKボタン */
document.querySelector("#back").addEventListener("click", () => {
  player.requestStop();
  song_select_mode = 0;
  SetSceneSongSelect();
});

/* 音符ボタン */
document.querySelector("#note").addEventListener("click", () => {
  effect_note = (effect_note + 1) % 2;
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
  ;
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
  ;
}

/* p5.js を初期化 */
new P5((p5) => {
  /* キャンバスの大きさなどを計算 */
  const width = default_width;
  const height = default_height;
  const margin = 50;
  const textAreaWidth = width - margin * 2;
  const frame_rate = 30;
  let lf_progress = 1;

  p5.preload = () => {
    /* 画像を読み込む */
    img_background = p5.loadImage("../img/background.png"); /* 背景 */
    img_startstop_play = p5.loadImage("../img/icon_start.png"); /* START/STOPボタン(再生中) */
    img_startstop_stop = p5.loadImage("../img/icon_pause.png"); /* START/STOPボタン(停止中) */
    img_back = p5.loadImage("../img/icon_back.png"); /* BACKボタン */
    img_note = p5.loadImage("../img/icon_note.png"); /* 音符ボタン */
    img_effect_note = p5.loadImage("../img/icon_note.png"); /* 音符ボタン */

    img_frame = p5.loadImage("../img/frame.png"); /* 歌詞フレーム */

    img_miku_body_normal = p5.loadImage("../img/miku_body_normal.png");
    img_miku_body_dance = p5.loadImage("../img/miku_body_dance.png");
    img_miku_body_sleep = p5.loadImage("../img/miku_body_sleep.png");

    img_miku_face_normal = p5.loadImage("../img/miku_face_normal.png");
    img_miku_face_smile = p5.loadImage("../img/miku_face_smile.png");
    img_miku_face_fun = p5.loadImage("../img/miku_face_fun.png");
    img_miku_face_sleep = p5.loadImage("../img/miku_face_sleep.png");

    img_song_button = p5.loadImage("../img/song_button.png");
    img_song_button_push = p5.loadImage("../img/song_button_push.png");
    img_scroll = p5.loadImage("../img/icon_scroll.png");

    /* アニメーション用テーブルを作成 */
    miku_table_body = [img_miku_body_normal, img_miku_body_dance, img_miku_body_sleep];
    miku_table_face = [img_miku_face_normal, img_miku_face_smile, img_miku_face_fun, img_miku_face_sleep];
    song_button_table = [img_song_button, img_song_button_push];
  };

  /* キャンバスを作成 */
  p5.setup = () => {
    let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(document.getElementById('p5js'));
    player.volume = 25;
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
    SetSceneSongSelect();
  };

  p5.draw = () => {
    switch (scene) {
    case 0:
      p5.SceneSongSelect();
      break;
    case 1:
      p5.ScenePlayer();
      break;
    default:
      break;
    }
  }

  /* 楽曲選択画面用シーン */
  p5.SceneSongSelect = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    p5.scale(general_magnification);
    p5.imageMode(p5.CORNER);
    p5.image(img_background, 0, 0);
    p5.image(img_frame, 0, 0);

    p5.fill(0, 0, 0);
    p5.textSize(50);
    for (let i = 0; i < 6; i++) {
      p5.image(song_button_table[song_button_pushed[i]], song_button_pos_default[i][0], song_button_pos_default[i][1]);
      p5.text(song_info[i][0],
              song_button_pos_default[i][0] + song_button_size_default[0] / 2,
              song_button_pos_default[i][1] + song_button_size_default[1] / 2 - 30);
      p5.text(song_info[i][1],
              song_button_pos_default[i][0] + song_button_size_default[0] / 2,
              song_button_pos_default[i][1] + song_button_size_default[1] / 2 + 30);
    }
    p5.textSize(80);
    p5.text(song_select_text[song_select_mode], song_select_text_pos[0], song_select_text_pos[1]);
  }

  /* 楽曲プレイヤー用シーン */
  p5.ScenePlayer = () => {
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

    /* 文字の描画 */
    let char = player.video.findChar(position - 100, { loose: true });
    let beat = player.findBeat(position);

    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    p5.scale(general_magnification);

    /* 背景とフレーム */
    p5.imageMode(p5.CORNER);
    p5.image(img_background, 0, 0);
    p5.image(img_frame, 0, 0);

    /* アイコン */
    /* サイズ調整 */
    img_back.resize(200, 0);
    img_startstop_play.resize(220, 0);
    img_startstop_stop.resize(220, 0);
    img_scroll.resize(150, 0);

    /* ビート情報の更新 */
    if (beat) {
      console.log("%d %d %d %d\n", beat.index, beat.position, beat.length, animation_offset_index);
      /* ビート境界時のみ */
      if (previous_beat &&
          (previous_beat.index < beat.index)) {
        animation_icon_scroll = (animation_icon_scroll + 1) % 2;
        if (beat.length % 2 == 0) {
          if (beat.position % 2 != 0) {
            p5.ProgressAnimation();
          }
        } else {
          if (beat.position == 1) {
            p5.ProgressAnimation();
          }
        }
      }
      previous_beat = beat;
    }

    p5.image(img_back, back_button_pos_default[0], back_button_pos_default[1]);
    /* 再生中 or 停止中でライトの色を切り替える */
    if (play_mode == 1) {
      p5.image(img_startstop_stop, startstop_button_pos_default[0], startstop_button_pos_default[1]);
    } else {
      p5.image(img_startstop_play, startstop_button_pos_default[0], startstop_button_pos_default[1]);
    }

    img_note.resize(350, 0);

    if (effect_note == 0) {
      p5.push();
      p5.tint(255, 30);
      p5.image(img_note, note_button_pos_default[0] - 55, note_button_pos_default[1] - 50);
      p5.pop();
    } else {
      p5.image(img_note, note_button_pos_default[0] - 55, note_button_pos_default[1] - 50);
      img_effect_note.resize(200, 0);
      p5.image(img_effect_note, effect_note_pos_table[0][animation_note_index][0], effect_note_pos_table[0][animation_note_index][1]);
      p5.image(img_effect_note, effect_note_pos_table[1][animation_note_index][0], effect_note_pos_table[1][animation_note_index][1]);
      p5.image(img_effect_note, effect_note_pos_table[2][animation_note_index][0], effect_note_pos_table[2][animation_note_index][1]);
    }

    if (animation_icon_scroll) {
      p5.image(img_scroll, icon_scrill_pos[0], icon_scrill_pos[1]);
    }

    p5.imageMode(p5.CENTER);

    let body_offset_x = miku_pos_offset_table[animation_offset_index][0];
    let body_offset_y = miku_pos_offset_table[animation_offset_index][1];
    let face_offset_x = miku_pos_offset_table[animation_offset_index][0];
    let face_offset_y = miku_pos_offset_table[animation_offset_index][1];

    miku_body = p5.GetMikuBody();
    if (miku_body == img_miku_body_sleep) {
      face_offset_y += miku_dot_size;
    }

    p5.image(miku_body,
             miku_pos_default[0] + body_offset_x,
             miku_pos_default[1] + body_offset_y);
    p5.image(p5.GetMikuFace(),
             miku_pos_default[0] + face_offset_x,
             miku_pos_default[1] + face_offset_y);

    /* 歌詞の描画 */
    p5.push();

    if (lf_time_list[current_line_num + 1] <= position) {
      current_line_num++;
    }

    /* 改行時のスクロール処理 */
    if (lf_time_list[current_line_num + 1] - 100 <= position) {
      lf_progress = (position + 100 - lf_time_list[current_line_num + 1]) / 100;
      console.log("%f", lf_progress);
    }

    for (let i = 0; i < char_list_size - 2; i++) {
      if ((char_list[i].line - 1 <= current_line_num) &&
          (current_line_num <= char_list[i].line + 2)) {
        const x = (char_list[i].pos + 0.5) * (textAreaWidth / max_text_in_line);
        let transparency = 1;
        let y = char_height_default
                - (current_line_num - char_list[i].line - 1 + lf_progress) * char_size_default * 1.2;
        let size = char_size_default;

        // 100 [ms] かけてフェードインしてくる
        if (position < char_list[i].start_time) {
          const progress = 1 - (char_list[i].start_time - position) / 100;
          const eased = Ease.circIn(progress);
          transparency = progress;
          size = char_size_default * eased + Math.min(width, height) * (1 - eased);
        }

        p5.fill(0, 0, 0, transparency * 100);
        p5.textSize(size);
        p5.text(char_list[i].char, margin + x, height / 2 + y);
      }
    }
  };

  p5.windowResized = () => {
    p5.ResizeWindow();
  };

/**
 * @fn GetMikuBody
 * @brief ミクさんのポーズを取得する
 * @return 使用する画像
 */
  p5.GetMikuBody = () => {
    let img = miku_table_body[1];
    let x_offset = 0;
    let y_offset = 0;
    switch (play_mode) {
    case 0:
      let date = new Date();
      sec = date.getSeconds();
      if (sec % 2 == 0) {
        img = miku_table_body[0];
      } else {
        img = miku_table_body[2];
      }
      break;
    case 1:
      img = miku_table_body[animation_pose_index];
    default:
      break;
    }
    return img;
  };

/**
 * @fn GetMikuFace
 * @brief ミクさんの表情を取得する
 * @return 使用する画像
 */
  p5.GetMikuFace = () => {
    let img = miku_table_face[1];
    switch (play_mode) {
    case 0:
      img = miku_table_face[3];
      break;
    case 1:
      if (player.findChorus(player.timer.position)) {
        /* サビ区間は><目になる */
        img = img = miku_table_face[2];
      } else {
        img = miku_table_face[0];
      }
      break;
    default:
      break;
    }
    return img;
  };

/**
 * @fn ProgressAnimation
 * @brief ダンスアニメーション用のパラメータを操作する
 * @return
 */
  p5.ProgressAnimation = () => {
    animation_pose_index = (animation_pose_index + 1) % 2;
    animation_offset_index = (animation_offset_index + 1) % 4;
    animation_note_index = (animation_note_index + 1) % 2;
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
      general_magnification = magnification_width;
    } else {
      general_magnification = magnification_height;
    }
    startstop_button = document.getElementById("startstop");
    startstop_button.style.width = (startstop_button_size_default[0] * general_magnification) + 'px';
    startstop_button.style.height = (startstop_button_size_default[1] * general_magnification) + 'px';
    startstop_button.style.left = (startstop_button_pos_default[0] * general_magnification) + 'px';
    startstop_button.style.top = (startstop_button_pos_default[1] * general_magnification) + 'px';

    back_button = document.getElementById("back");
    back_button.style.width = (back_button_size_default[0] * general_magnification) + 'px';
    back_button.style.height = (back_button_size_default[1] * general_magnification) + 'px';
    back_button.style.left = (back_button_pos_default[0] * general_magnification) + 'px';
    back_button.style.top = (back_button_pos_default[1] * general_magnification) + 'px';

    note_button = document.getElementById("note");
    note_button.style.width = (note_button_size_default[0] * general_magnification) + 'px';
    note_button.style.height = (note_button_size_default[1] * general_magnification) + 'px';
    note_button.style.left = (note_button_pos_default[0] * general_magnification) + 'px';
    note_button.style.top = (note_button_pos_default[1] * general_magnification) + 'px';

    song0_button = document.getElementById("song_0");
    song0_button.style.width = (song_button_size_default[0] * general_magnification) + 'px';
    song0_button.style.height = (song_button_size_default[1] * general_magnification) + 'px';
    song0_button.style.left = (song_button_pos_default[0][0] * general_magnification) + 'px';
    song0_button.style.top = (song_button_pos_default[0][1] * general_magnification) + 'px';

    song1_button = document.getElementById("song_1");
    song1_button.style.width = (song_button_size_default[0] * general_magnification) + 'px';
    song1_button.style.height = (song_button_size_default[1] * general_magnification) + 'px';
    song1_button.style.left = (song_button_pos_default[1][0] * general_magnification) + 'px';
    song1_button.style.top = (song_button_pos_default[1][1] * general_magnification) + 'px';

    song2_button = document.getElementById("song_2");
    song2_button.style.width = (song_button_size_default[0] * general_magnification) + 'px';
    song2_button.style.height = (song_button_size_default[1] * general_magnification) + 'px';
    song2_button.style.left = (song_button_pos_default[2][0] * general_magnification) + 'px';
    song2_button.style.top = (song_button_pos_default[2][1] * general_magnification) + 'px';

    song3_button = document.getElementById("song_3");
    song3_button.style.width = (song_button_size_default[0] * general_magnification) + 'px';
    song3_button.style.height = (song_button_size_default[1] * general_magnification) + 'px';
    song3_button.style.left = (song_button_pos_default[3][0] * general_magnification) + 'px';
    song3_button.style.top = (song_button_pos_default[3][1] * general_magnification) + 'px';

    song4_button = document.getElementById("song_4");
    song4_button.style.width = (song_button_size_default[0] * general_magnification) + 'px';
    song4_button.style.height = (song_button_size_default[1] * general_magnification) + 'px';
    song4_button.style.left = (song_button_pos_default[4][0] * general_magnification) + 'px';
    song4_button.style.top = (song_button_pos_default[4][1] * general_magnification) + 'px';

    song5_button = document.getElementById("song_5");
    song5_button.style.width = (song_button_size_default[0] * general_magnification) + 'px';
    song5_button.style.height = (song_button_size_default[1] * general_magnification) + 'px';
    song5_button.style.left = (song_button_pos_default[5][0] * general_magnification) + 'px';
    song5_button.style.top = (song_button_pos_default[5][1] * general_magnification) + 'px';
  };
});

/**
 * @fn SetSceneSongSelect
 * @brief 楽曲選択画面に遷移させる
 * @return
 */
const SetSceneSongSelect = () => {
  scene = 0;
  document.getElementById('song_select').style.display = "flex";
  document.getElementById('startstop').style.display = "none";
  document.getElementById('back').style.display = "none";
  document.getElementById('note').style.display = "none";
  document.getElementById('p5js').style.display = "flex";
}

/**
 * @fn SetScenePlayer
 * @brief プレイヤー画面に遷移させる
 * @return
 */
const SetScenePlayer = () => {
  scene = 1;
  document.getElementById('song_select').style.display = "none";
  document.getElementById('startstop').style.display = "block";
  document.getElementById('back').style.display = "block";
  document.getElementById('note').style.display = "block";
  document.getElementById('p5js').style.display = "flex";
}

/**
 * @fn CreatePositionList
 * @brief 歌詞の配置リストを作成する
 */
const CreatePositionList = (song_id) => {
  let pos_in_line = 0;
  let manual_lf_list;
  let manual_lf_list_index = 0;
  let manual_lf_list_size = 0;

  char_list = {};
  line_num = 0;
  current_line_num = 0;
  char_list_size = 0;

  switch (song_id) {
  case 0:
    manual_lf_list = [...manual_lf_list_song0];
    break;
  case 1:
    manual_lf_list = [...manual_lf_list_song1];
    break;
  case 2:
    manual_lf_list = [...manual_lf_list_song2];
    break;
  case 3:
    manual_lf_list = [...manual_lf_list_song3];
    break;
  case 4:
    manual_lf_list = [...manual_lf_list_song4];
    break;
  case 5:
    manual_lf_list = [...manual_lf_list_song5];
    break;
  default:
    break;
  }
  manual_lf_list_size = manual_lf_list.length;

  let char = player.video.findChar(0, {loose: true}); /* 最初の発声文字 */
  while(char != null) {
    char_index = player.video.findIndex(char);

    if ((manual_lf_list_index < manual_lf_list_size) &&
        (char_index == manual_lf_list[manual_lf_list_index])) {
      lf_time_list[line_num] = char.startTime;
      line_num++;
      pos_in_line = 0;
      manual_lf_list_index++;
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
    pos_in_line++;
    char_list_size++;
  }

  console.log(char_list);
  console.log(lf_time_list);

  char_list_size++;
}
