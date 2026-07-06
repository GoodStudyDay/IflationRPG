export type LanguageCode = 'ja' | 'en' | 'zh-Hant' | 'zh-Hans' | 'ko' | 'es' | 'id';

export interface LanguageInfo {
  code: LanguageCode;
  name: {
    ja: string;
    en: string;
    'zh-Hant': string;
    'zh-Hans': string;
    ko: string;
    es: string;
    id: string;
  };
  index: number;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'ja', name: { ja: '日本語', en: '日本語', 'zh-Hant': '日文', 'zh-Hans': '日文', ko: '일본어', es: 'Japonés', id: 'Bahasa Jepang' }, index: 0 },
  { code: 'en', name: { ja: 'English', en: 'English', 'zh-Hant': 'English', 'zh-Hans': 'English', ko: '영어', es: 'Inglés', id: 'Bahasa Inggris' }, index: 1 },
  { code: 'zh-Hant', name: { ja: '繁體中文', en: '繁體中文', 'zh-Hant': '繁體中文', 'zh-Hans': '繁体中文', ko: '번체중국어', es: 'Chino Tradicional', id: 'Bahasa China Tradisional' }, index: 2 },
  { code: 'zh-Hans', name: { ja: '简体中文', en: '简体中文', 'zh-Hant': '簡體中文', 'zh-Hans': '简体中文', ko: '간체중국어', es: 'Chino Simplificado', id: 'Bahasa China Sederhana' }, index: 3 },
  { code: 'ko', name: { ja: '한국어', en: '한국어', 'zh-Hant': '韓語', 'zh-Hans': '韩语', ko: '한국어', es: 'Coreano', id: 'Bahasa Korea' }, index: 4 },
  { code: 'es', name: { ja: 'Español', en: 'Español', 'zh-Hant': '西班牙語', 'zh-Hans': '西班牙语', ko: '스페인어', es: 'Español', id: 'Bahasa Spanyol' }, index: 5 },
  { code: 'id', name: { ja: 'Bahasa Indonesia', en: 'Bahasa Indonesia', 'zh-Hant': '印尼語', 'zh-Hans': '印尼语', ko: '인도네시아어', es: 'Indonesio', id: 'Bahasa Indonesia' }, index: 6 },
];

export interface TranslationKey {
  ja: string;
  en: string;
  'zh-Hant': string;
  'zh-Hans': string;
  ko: string;
  es: string;
  id: string;
}

export const translations: Record<string, TranslationKey> = {
  LV: { ja: 'LV', en: 'LV', 'zh-Hant': 'LV', 'zh-Hans': 'LV', ko: 'LV', es: 'NV', id: 'LV' },
  ニャーRPGクエスト: { ja: 'ニャーRPGクエスト', en: 'Bean RPG', 'zh-Hant': '豆RPG', 'zh-Hans': '豆RPG', ko: 'Bean RPG', es: 'Bean RPG', id: 'Bean RPG' },
  はい: { ja: 'はい', en: 'OK', 'zh-Hant': '是的', 'zh-Hans': '是的', ko: '예', es: 'Sí', id: 'Iya Nih' },
  決定: { ja: '決定', en: 'OK', 'zh-Hant': '決定', 'zh-Hans': '决定', ko: '결정', es: 'OK', id: 'OK' },
  キャンセル: { ja: 'キャンセル', en: 'Cancel', 'zh-Hant': '取消', 'zh-Hans': '取消', ko: '취소', es: 'Cancelar', id: 'Batal' },
  閉じる: { ja: '閉じる', en: 'Close', 'zh-Hant': '關閉', 'zh-Hans': '关闭', ko: '닫는다', es: 'Cerrar', id: 'Tutup' },
  戻る: { ja: '戻る', en: 'Back', 'zh-Hant': '返回', 'zh-Hans': '返回', ko: '돌아가기', es: 'Atrás', id: 'Kembali' },
  いいえ: { ja: 'いいえ', en: 'No', 'zh-Hant': '否', 'zh-Hans': '否', ko: '아니요', es: 'No', id: 'Tidak' },
  武器: { ja: '武器', en: 'Weapon', 'zh-Hant': '武器', 'zh-Hans': '武器', ko: '무기', es: 'Arma', id: 'Senjata' },
  防具: { ja: '防具', en: 'Armor', 'zh-Hant': '防具', 'zh-Hans': '防具', ko: '방어구', es: 'Armadura', id: 'Tameng' },
  アクセサリー: { ja: 'アクセサリー', en: 'Accessories', 'zh-Hant': '裝飾品', 'zh-Hans': '饰品', ko: '액세서리', es: 'Accesorios', id: 'Aksesoris' },
  ステータス: { ja: 'ステータス', en: 'Stats', 'zh-Hant': '能力値', 'zh-Hans': '属性', ko: '스테이터스', es: 'Atributos', id: 'STATUS' },
  価格: { ja: '価格', en: 'Cost', 'zh-Hant': '價格', 'zh-Hans': '价格', ko: '가격', es: 'Precio', id: 'Harga' },
  ボーナス: { ja: 'ボーナス', en: 'Bonus', 'zh-Hant': 'Bonus', 'zh-Hans': 'Bonus', ko: 'Bonus', es: 'Bonus', id: 'Bonus' },
  所持金: { ja: '所持金', en: 'Money', 'zh-Hant': 'Money', 'zh-Hans': 'Money', ko: 'Money', es: 'Dinero', id: 'Money' },
  '現在の所持金[0]': { ja: '現在の所持金[0]', en: 'Currently holding [0]G', 'zh-Hant': '現在的持有金額為 [0]G', 'zh-Hans': '当前所持金额为 [0]G', ko: '현재 소지금은 [0]G', es: 'Ahora tienes [0]G', id: 'Uang di tangan [0]G' },
  'レベルアップ!': { ja: 'レベルアップ!', en: 'LEVEL UP!', 'zh-Hant': 'LEVEL UP!', 'zh-Hans': 'LEVEL UP!', ko: 'LEVEL UP!', es: 'NIVEL UP!', id: 'LEVEL UP!' },
  日本語: { ja: '日本語', en: 'English', 'zh-Hant': '繁體中文', 'zh-Hans': '简体中文', ko: '한국어', es: 'Español', id: 'Bahasa Indonesia' },
  ゲームスタート: { ja: 'ゲームスタート', en: 'Start Game', 'zh-Hant': '遊戲開始', 'zh-Hans': '游戏开始', ko: '게임 스타트', es: 'Empezar juego', id: 'Mulai Game' },
  プレイヤー情報: { ja: 'プレイヤー情報', en: 'Statistics', 'zh-Hant': '遊戲情報', 'zh-Hans': '游戏信息', ko: '게임 정보', es: 'Datos de juego', id: 'Informasi permainan' },
  ランキング: { ja: 'ランキング', en: 'Leaderboard', 'zh-Hant': '排行', 'zh-Hans': '排行', ko: '랭킹', es: 'Ranking', id: 'Peringkat' },
  オプション: { ja: 'オプション', en: 'Settings', 'zh-Hant': '設定', 'zh-Hans': '设置', ko: '옵션', es: 'Configuración', id: 'Pengaturan' },
  やり直す: { ja: 'やり直す', en: 'Try Again', 'zh-Hant': '重新開始', 'zh-Hans': '重新开始', ko: '다시 하기', es: 'Reempezar', id: 'Mulai ulang' },
  前回までの引き継いでます: { ja: '前回までの引き継いでます', en: 'Equipment obtained in previous\ngames will not be passed on.', 'zh-Hant': '正在繼續直到上次進行遊戲時所得到的裝備等道具', 'zh-Hans': '正在继承之前在游戏中得到的装备', ko: '이전까지의 게임에서 얻은 장비 등은 계승되어 있습니다', es: 'No conservarás el equipo que\nhayas conseguido hasta ahora.', id: 'Kamu masih akan memiliki\nperlengkapan/equipment yang telah kamu\ndapatkan dalam permainan sebelumnya' },
  続きから始める: { ja: '続きから始める', en: 'Continue', 'zh-Hant': '繼續遊戲', 'zh-Hans': '继续', ko: '계속 하기', es: 'Continuar', id: 'Lanjutkan' },
  新しく手に入れた装備アイテムやロック解除は: { ja: '新しく手に入れた装備アイテムやロック解除は', en: 'Newly obtained equipment is not passed on if you do not reach game over.\nTry again?', 'zh-Hant': '新得到的裝備等如果不玩到遊戲結束就無法繼承。\n確定要復原嗎?', 'zh-Hans': '新得到的装备等在游戏结束后才能继承。\n重新开始吗?', ko: '새로 획득한 장비 등은 게임 오버가되지 않으면 계승되지 않습니다\n다시 하시겠습니까?', es: 'No conservarás el equipo nuevo a menos que antes termines el juego\n¿Quieres reempezar?', id: 'Perlengkapan baru yang kamu dapatkan dalam permainan kali ini akan hilang jika mengalami game over\nMemulai ulang?' },
  キャラクター選択: { ja: 'キャラクター選択', en: 'Character Select', 'zh-Hant': '角色選擇', 'zh-Hans': '选择角色', ko: '캐릭터 선택', es: 'Selección de personaje', id: 'Pilih karakter' },
  'キャラクターを選択してください。': { ja: 'キャラクターを選択してください。', en: 'Please select a character.', 'zh-Hant': '請選擇角色。', 'zh-Hans': '请选择角色。', ko: '캐릭터를 선택하십시오.', es: 'Por favor, selecciona un personaje.', id: 'Silakan pilih karaktermu' },
  ベース能力: { ja: 'ベース能力', en: 'Base Abilities', 'zh-Hant': '基本能力', 'zh-Hans': '天赋', ko: '베이스 능력', es: 'Habilidad base', id: 'Kemampuan dasar' },
  '※ベース能力LVとキャラクター能力LVの合計が': { ja: '※ベース能力LVとキャラクター能力LVの合計が', en: 'A multiplier bonus will be added to your status value that\nis as high as the total of Base Abilities and Character Abilities ', 'zh-Hant': '基本能力LV與角色能力LV合計越高素質值就會有倍數加成', 'zh-Hans': '天赋和角色能力的合计越高，数据值的倍率额外奖励会增加更多', ko: '베이스 능력와 캐릭터 능력의 합계가 높을\n수록 스테이터스 수치에 배율 보너스가 가산됩니다', es: 'Cuanto más alta sea la suma de tu Habilidad Base y tu Habilidad de\nPersonaje recibirás una bonificación mayor a tus atributos', id: 'Semakin tinggi jumlah total kemampuan dasar dan kemampuan karakter,\nsemakin berlipat-ganda bonus yang ditambahkan pada nilai status' },
  '※キャラクターは後からでも変更': { ja: '※キャラクターは後からでも変更', en: '', 'zh-Hant': '', 'zh-Hans': '', ko: '', es: '', id: '' },
  '+キャラ能力': { ja: '+キャラ能力', en: 'Ability', 'zh-Hant': '+角色能力', 'zh-Hans': '+角色能力', ko: '캐릭터 능력', es: 'Habilidad', id: 'Kemampuan' },
  残りプレイ回数: { ja: '残りプレイ回数', en: 'Remaining Lives', 'zh-Hant': '剩餘遊玩次數', 'zh-Hans': '剩余游戏次数', ko: '남은 플레이 횟수', es: 'Número restante de Vidas', id: 'Sisa kali permainan' },
  プレイ回数回復残り時間: { ja: 'プレイ回数回復残り時間', en: 'Remaining time for a new Life', 'zh-Hant': '回復遊玩次數所需時間', 'zh-Hans': '游戏次数恢复剩余时间', ko: '플레이 횟수 회복까지', es: 'Tiempo restante para una nueva Vida', id: 'Sisa waktu pemulihan kali permainan' },
  ノーマル: { ja: 'ノーマル', en: 'Normal', 'zh-Hant': '普通', 'zh-Hans': '普通', ko: '일반', es: 'Normal', id: 'Normal' },
  ハード: { ja: 'ハード', en: 'Hard', 'zh-Hant': '困難', 'zh-Hans': '困难', ko: '하드', es: 'Difícil', id: 'Sulit' },
  難易度選択: { ja: '難易度選択', en: 'Select Difficulty', 'zh-Hant': '選擇難易度', 'zh-Hans': '选择难度', ko: '난이도 선택', es: 'Seleccionar Dificultad', id: 'Pilih tingkat kesulitan' },
  '・残り戦闘回数が30から10に変...': { ja: '・残り戦闘回数が30から10に変更！\n・敵の強さが大幅に上昇！\n・獲得経験値が10倍以上！\n・特殊フィールドの追加！(未実装)\n\n・アイテムの追加！', en: '・Changed Battle Points from 30 to 10!\n・Greatly increased enemy strength!\n・EXP acquired multiplied by 24!\n・Special stage added!(Coming Soon)\n\n・Items added!', 'zh-Hant': '・戰鬥次數從30變更成10！\n・敵人的強度大幅提升！\n・獲得EXP變成10倍！\n・追加特殊關卡！(未實裝)\n\n・強力物品追加！', 'zh-Hans': '・战斗次数从 30 变为 10！\n・敌人实力大幅提升！\n・获得的 EXP 变为 10 倍！\n・追加特殊关卡！(未安装)\n\n・追加强化物品！', ko: '- 전투 회수가 30부터 10으로 변경!\n- 적의 강한 정도가 큰 폭으로 상승!\n- 획득 EXP가 10배!\n- 특수 스테이지 추가! (미업데이트)\n\n- 강한 아이템 추가!', es: '・¡El número de Puntos de Combate pasa de 30 a 10 !\n・¡Gran aumento de la fuerza de los enemigos!\n・¡La EXP adquirida se multiplica por 24!\n・¡Añadida area especial!(no implementado)\n\n・¡Añadidos objetos!', id: '・Jumlah pertarungan berubah dari 30 jadi 10.\n・Kekuatan musuh jauh meningkat.\n・Nilai EXP jadi 10 kali lipat.\n・Tambah tingkatan spesial.(Tidak berlaku)\n\n・Tambah barang.' },
  '※通常の新フィールドはハードだけでなくノーマルにも': { ja: '※通常の新フィールドはハードだけでなくノーマルにも追加します。', en: '* New regular stages will be added to normal and hard modes.', 'zh-Hant': '※一般的新關卡不只會加到困難模式之中，還會加到普通模式裡。', 'zh-Hans': '※通常，不仅会在高难度模式中新增关卡，普通难度模式中也会新增关卡。', ko: '※일반 새 스테이지는 \'어려움\'뿐 아니라 \'보통\'에도 추가됩니다.', es: '* Nueva areas pueden ser añadidas no solo al\nModo Difícil sino también al Modo Normal.', id: '* Tingkatan baru tak hanya tersedia dalam modus Hard tapi juga Normal.' },
  '※未実装アイテム\n': { ja: '※未実装アイテム\n', en: '* New Items Coming Soon\n  Weapons Hard No.[0], Armor Hard No.[1]\n  Accessories Hard No.[2]', 'zh-Hant': '※未實裝道具\n  武器 Hard No.[0]、 防具 Hard No.[1]\n  裝飾品 Hard No.[2]', 'zh-Hans': '※未装备物品\n  武器 Hard No.[0]、 防具 Hard No.[1]\n  饰品 Hard No.[2]', ko: '※미업데이트 아이템\n  무기 Hard No.[0], 방어구 Hard No.[1]\n  액세서리 Hard No.[2]', es: '* Artículos no implementados\n  Arma Hard No.[0]; Armadura Hard No.[1]\n  Accesorios Hard No.[2]', id: '* Item Tak Berlaku\n  Senjata Hard No. [0], Armor Hard No. [1]\n  Aksesoris Hard No. [2]' },
  ハード解放条件: { ja: 'ハード解放条件', en: 'Requirements to unlock Hard mode', 'zh-Hant': '困難模式開放條件', 'zh-Hans': '困难模式开启条件', ko: '하드모드 개방 조건', es: 'Condiciones para desbloquar el Modo Difícil', id: 'Syarat membuka mode sulit' },
  '[0]LV 突破！': { ja: '[0]LV 突破！', en: 'Cleared level [0]!', 'zh-Hant': '[0]LV突破!', 'zh-Hans': '突破 [0]LV!', ko: '[0]LV 돌파!', es: '¡Pasar de [0] LV!', id: 'Melebihi [0]LV!' },
  LOCKED: { ja: 'LOCKED', en: 'LOCKED', 'zh-Hant': 'LOCKED', 'zh-Hans': '已上锁', ko: '잠김', es: 'BLOQUEADO', id: 'LOCKED' },
  戦闘終了後: { ja: '戦闘終了後', en: 'After the battle', 'zh-Hant': '戰鬥結束後', 'zh-Hans': '战斗结束后', ko: '전투 종료 후', es: 'Configurar la distribución de\natributos tras un combate', id: 'Setelah pertarungan berakhir' },
  ステータス振り分け設定: { ja: 'ステータス振り分け設定', en: 'Status allocation settings', 'zh-Hant': '分配能力値設定', 'zh-Hans': '属性分配设定', ko: '스테이터스 배분 설정', es: '', id: 'Pengaturan pembagian status' },
  遊び方: { ja: '遊び方', en: 'Tutorial', 'zh-Hant': '遊戲說明', 'zh-Hans': '游戏说明', ko: '게임 설명', es: 'Tutorial', id: 'Cara bermain' },
  レビューする: { ja: 'レビューする', en: 'Rating', 'zh-Hant': '評價', 'zh-Hans': '评价', ko: '평가', es: 'Valorar', id: 'Beri rating' },
  面白ぜひレビューを: { ja: '面白ぜひレビューを', en: 'Please be sure to review it if it\'s interesting.', 'zh-Hant': '如果觉得好玩请务必写下您的评论。', 'zh-Hans': '若您覺得有趣的話，務請您予以評分。', ko: '재미 있으면 꼭 리뷰를 부탁드립니다.', es: 'Si te gusta escríbenos una reseña, por favor.', id: 'Mohon ulasannya jika anda menikmati ini.' },
  言語設定: { ja: '言語設定', en: 'Language', 'zh-Hant': '語言', 'zh-Hans': '语言', ko: '언어', es: 'Idioma', id: 'Bahasa' },
  データ引き継ぎ: { ja: 'データ引き継ぎ', en: 'Backup', 'zh-Hant': '備份', 'zh-Hans': '备份', ko: '백업', es: 'Copia de seguridad', id: 'Cadangan' },
  現在の言語: { ja: '現在の言語', en: '', 'zh-Hant': '', 'zh-Hans': '', ko: '', es: '', id: '' },
  'アプリを再起動しないと完全': { ja: 'アプリを再起動しないと完全', en: 'It does not reflect completely if you do not restart the application.', 'zh-Hant': '', 'zh-Hans': '', ko: '', es: 'No tiene efecto completo si no reinicias la aplicación.', id: '' },
  '個人で作ったアプリです。誤訳が': { ja: '個人で作ったアプリです。誤訳が', en: 'This is an individually produced app.\nPlease feel free to let me know of any necessary corrections if you find grammatical or vocabulary mistakes in the translation. Thank you.', 'zh-Hant': '', 'zh-Hans': '', ko: '', es: 'Esta es un app producida individualmente.\nSiéntete libre de hacerme saber si hay correcciones necesarias si encuentras errores gramaticales o de vocabulario en la traducción. Gracias.', id: '' },
  FORM: { ja: 'FORM', en: 'Form', 'zh-Hant': 'Form', 'zh-Hans': 'Form', ko: 'Form', es: 'Corrección', id: 'Form' },
  後で表示する: { ja: '後で表示する', en: 'Show later', 'zh-Hant': '以后再显示', 'zh-Hans': '之後顯示', ko: '나중에 보기', es: 'Mostrar luego', id: 'Nanti saja' },
  '1:戦闘終了後、': { ja: '1:戦闘終了後、', en: '1 : After the battle, show stat allocation menu.', 'zh-Hant': '1 : 戰鬥結束後，顯示分配能力値畫面。', 'zh-Hans': '1 : 战斗结束后，显示属性分配界面。', ko: '1 : 전투 종료 후, 스테이터스 배분 화면 표시', es: '1 : Tras un combate, mostrar el menú de atributos.', id: '1 : Setelah pertarungan berakhir, tampilkan layar menu status.' },
  '2:戦闘終了後、': { ja: '2:戦闘終了後、', en: '2: Dont show and set by yourself.', 'zh-Hant': '2: 不显示界面，也不进行加点.', 'zh-Hans': '2: 不显示界面，也不进行加点', ko: '2: 전투가 끝나고 올릴 스텟의 비율을 정합니다.  ', es: '2: Determines the percentage of stats to increase after battle.', id: '2: Determines the percentage of stats to increase after battle.' },
  '3:表示しない。': { ja: '3:表示しない。', en: '3 : Do not show.Set by preset', 'zh-Hant': '3 : 不显示界面，使用预设加点', 'zh-Hans': '3 : 不显示界面，使用预设加点', ko: '3 : 공방체 2,1,1 자동', es: '3 : No mostrar', id: '3 : Jangan tampilkan' },
  '(現在の設定)': { ja: '(現在の設定)', en: 'Current settings', 'zh-Hant': '目前的設定', 'zh-Hans': '当前设定', ko: '현재 설정', es: 'Configuración actual', id: 'Pengaturan saat ini' },
  '[0]選択': { ja: '[0]選択', en: 'Option [0]', 'zh-Hant': 'ON [0]', 'zh-Hans': 'ON [0]', ko: 'ON [0]', es: 'Opción [0]', id: 'ON [0]' },
  クレジット: { ja: 'クレジット', en: 'Credits', 'zh-Hant': 'Credits', 'zh-Hans': 'Credits', ko: 'Credits', es: 'Créditos', id: 'Credits' },
  遊び方1: { ja: '遊び方1', en: 'You can increase your levels to over 100LV from just 1 battle! An exciting game of steady progression.  Go for the highest levels within a limited number of battles!', 'zh-Hant': '在一次的戰鬥之中甚至可以提昇100以上的等級！\n快速推進的爽快型遊戲。在有限的戰鬥次數中追求最高的等級吧！', 'zh-Hans': '1次战斗可以升级到100LV以上！这是一个可以快速进行的爽快游戏。目标用有限的战斗次数升到更高的等级吧！', ko: '한 번의 전투로 100레벨 이상 레벨업이 가능！\n사박사박 진행할 수 있는 상쾌한 게임입니다. 한정된 횟수의 전투로 고레벨을 목표로 하세요!', es: '¡Sube más de 100 niveles con un solo combate!\nUn emocionante juego en el que podrás avanzar sin parar. ¡Intenta alcanzar un nivel alto en unos pocos combates!', id: 'Dalam satu kali pertempuran, memungkinkan utk naik level ke 100LV lebih!Game ini dapat berlanjut dengan menyenangkan.Cobalah level yang lebih tingg dengan beberapakali pertempuran!' },
  ゲーム説明: { ja: 'ゲーム説明', en: 'Game description', 'zh-Hant': '遊戲說明', 'zh-Hans': '游戏说明', ko: '게임 설명', es: 'Instrucciones', id: 'Cara Bermain' },
  遊び方2: { ja: '遊び方2', en: 'You can only battle up to 30 times. Once you are out of battles the game will end.\nEven if your levels rise, you will not increase your strength unless you distribute your Stat Points. Go to the menu screen to distribute them and increase your strength.\nWhen the game is over, you can register your achieved level in the leaderboard.\nAcquired equipment can be carried over into the next game.\nHowever, please note that money, levels, and stats will not carry over.', 'zh-Hant': '玩家只能進行30次的戰鬥。\n當您剩餘的戰鬥次數(BATTLE POINT)歸零時遊戲就結束了。\n當玩家的等級提昇後，如果沒有分配能力值的話也無法強化角色。\n您可以在MENU進行能力值分配強化角色。\n就算您的遊戲結束了，等級也會被記錄在排行之中。\n而您所獲得的裝備將可以繼承到下一輪的遊戲之中。\n但是您所擁有的金錢、等級與能力值無法繼承，請特別注意這點。', 'zh-Hans': '最多只能进行30次战斗。剩下的战斗次数(BATTLE POINT)消耗光后游戏结束。\n玩家的级别上升后，若是不进行平分点数，便无法强化。\n在MENU中平分点数进行强化吧。\n游戏结束后可以将级别登录在排行中。\n获得的装备等可以在下次的游戏中继承。\n但是金钱和等级，数据等无法继承，请注意。', ko: '전투는 30회로 한정됩니다. 나머지 전투횟수(BATTLE POINT)가 모두 소진되면 게임 오버가 됩니다.\n플레이어의 레벨이 올라도 능력치를 배분하지 않으면 강화할 수 없습니다.\nMENU에서 능력치를 배분해 강화해 보세요.\n게임 오버가 되면 레벨을 랭킹에 등록할 수 있습니다.\n획득한 장비 등은 다음 게임에서 계속 이용할 수 있습니다. 단, 돈이나 레벨, 능력치는 초기화되므로 주의하십시오.', es: 'Solo podrás combatir un máximo de 30 veces. Cuando se te acaben los Puntos de Combate (BATTLE POINTS), se terminará la partida.\nAunque el jugador siga subiendo de nivel, tus atributos no aumentaran a no ser que distribuyas tus Puntos de Atributo\nDistribuye los puntos en el menú y sube tus atributos\nUna vez hayas terminado la partida, podrás registrar tu nivel en el ranking\nPodrás conservar el equipo y los objetos que hayas obtenido en la siguiente partida\nPero, atención, no podrás conservar el dinero, el nivel o los atributos', id: 'Hanya dapat bermain sampai dengan 30 kali. Apabila kehilangan sisa jumlah bermain(BATTLE POINT) maka akan game over.\nWalaupun levelnya naik, tapi kekuatannya tetep harus dibagi.\nMari kita memperkuat dan mendistribusikan status\nApabila gameover, rangking akan tercatat.\nAnda dapat mengambil alih pada game berikutnya, seperti peralatan yang diperoleh\nNamun Level dan uang harus diperhatikan karena status tidak bisa mengambil alih' },
  フィールド: { ja: 'フィールド', en: 'Field', 'zh-Hant': '場地', 'zh-Hans': '战场', ko: '필드', es: 'Áreas', id: 'Field' },
  遊び方3: { ja: '遊び方3', en: 'Beginners should, whenever possible, battle at locations appropriate to their level.  Please note that if you battle at a location above your appropriate level you will have difficulty defeating your enemy!', 'zh-Hant': '初學者請到符合適合LV的地方進行場地。\n超過適合LV場地裡的敵人可是很難戰勝的，請特別注意這點！', 'zh-Hans': '新手请在适合适当LV的地方战斗吧。在适当LV之上的地方战斗的话一般是不太容易打赢敌人的，请注意！', ko: '초심자는 적정LV에 맞는 장소에서 전투를 진행하세요. 적정LV 이상의 장소에서는 적에게 이기는 것이 어려우므로 주의가 필요합니다!', es: 'Es recomendable que los principiantes permanezcan y luchen dentro de áreas aptas para su nivel\nTen cuidado, es muy difícil vencer a los enemigos en lugares con un nivel apto mayor que el tuyo', id: 'Utk pemula, bermainlah di tempat yang telah ditentukan. Apabila bertempur ditempat yang lebih tinggi akan sulit mengalahkan lawan!' },
  遊び方4: { ja: '遊び方4', en: 'When your levels rise you will receive Stat Points in order to increase your stats.\nWhen your levels rise, make sure to immediately distribute them!\nA player can unleash multiple attacks and critical hits according to their stats.', 'zh-Hant': '等級上升後就可以獲得能夠強化能力值的能力點數。\n等級上升後請記得要馬上進行分配！\n依照玩家能力值的不同，將會不停施展連續攻擊與必殺攻擊出來炸裂對手。', 'zh-Hans': '级别升高后可以得到强化数据用的属性点。\n级别升高后立刻平分吧！\n根据玩家的数据不同会产生连续攻击或爆击。', ko: '레벨이 오르면 능력치를 강화하기 위한 스테이터스 포인트를 획득할 수 있습니다. 레벨이 오르면 곧바로 배분하세요!\n플레이어의 능력치에 따라 연속 공격, 위기 히트가 작렬합니다.', es: 'Al ir subiendo de nivel, conseguirás Puntos de Atributo que te permitirán incrementar tus atributos\n¡Distribúyelos nada más subir de nivel!\nGracias a los atributos de personaje, las combinaciones de ataques y los ataques críticos se sucederán a un ritmo explosivo.', id: 'Utk menjadi kuat dan naik level dapat mengambil Status Point \nApabila sudah naik level maka harus segera membaginya!\nPenyerangan akan berkelanjitan dan criticalhint akan meledak' },
  戦闘: { ja: '戦闘', en: 'Battle', 'zh-Hant': '戰鬥', 'zh-Hans': '战斗', ko: '전투', es: 'Combate', id: 'Pertempuran' },
  遊び方5: { ja: '遊び方5', en: 'Battles will progress semi-automatically.\nDuring battle, if you touch the screen you can choose to fully recover HP.\nPlease note that when recovering HP you will be charged large sums of money so you won\'t be able to do it too many times!', 'zh-Hant': '戰鬥系統基本為半自動進行。\n在戰鬥時只要點擊畫面就可以完全回復HP。但是回復HP會花費大量的金錢所以無法連續使用，請特別注意這點！', 'zh-Hans': '战斗为半自动进行。\n点击战斗中的画面后可以选择HP全部回复。回复HP将消耗高额的金钱，无法多次进行，请注意！', ko: '전투는 반자동으로 진행됩니다. 전투 중에 화면을 터치하면 HP 전체 회복을 선택할 수 있습니다. HP를 회복하는 경우, 고액의 금액이 소모되어 많이 사용할 수 없으므로 주의하세요!', es: 'Los combates se desarrollan de manera semiautomática.\nTocando la pantalla, tendrás la opción de recuperar todos los puntos de salud.\nPero ten cuidado, ¡recuperar los puntos de salud cuesta mucho dinero y no lo podrás hacer muy a menudo!', id: 'Pertempuran dilakukan dengan cara semi otomatis\nApabila disentuh maka akan dapat meilih pilihan utk memulihkan\nPerlu diingat bahwa hal itu tidak bisa berkali-kali jika Anda ingin memulihkan HP!' },
  発見マップ数: { ja: '発見マップ数', en: 'Maps', 'zh-Hant': 'Map', 'zh-Hans': 'Map', ko: 'Map', es: 'Mapas', id: 'Map' },
  発見ボス数: { ja: '発見ボス数', en: 'Bosses', 'zh-Hant': 'Boss', 'zh-Hans': 'Boss', ko: 'Boss', es: 'Jefes', id: 'Boss' },
  ゲームプレイ回数: { ja: 'ゲームプレイ回数', en: 'Times Played', 'zh-Hant': '進行遊戲次數', 'zh-Hans': '游戏次数', ko: '게임플레이 횟수', es: 'Número de partidas', id: 'Jumlah kali permainan' },
  所持武器数: { ja: '所持武器数', en: 'Weapons', 'zh-Hant': '武器', 'zh-Hans': '武器', ko: '무기', es: 'Arma', id: 'Senjata' },
  所持防具数: { ja: '所持防具数', en: 'Armors', 'zh-Hant': '防具', 'zh-Hans': '防具', ko: '방어구', es: 'Armadura', id: 'Tameng' },
  所持アクセサリー数: { ja: '所持アクセサリー数', en: 'Accessories', 'zh-Hant': '裝飾品', 'zh-Hans': '饰品', ko: '액세서리', es: 'Accesorios', id: 'Aksesoris' },
  最高レベル達成時のステータス・装備アイテム: { ja: '最高レベル達成時のステータス・装備アイテム', en: 'Stats and equipment during best level', 'zh-Hant': '達成最高等級時的能力値與裝備', 'zh-Hans': '达到最高等级时的数据和装备', ko: '최고 레벨 달성 시 능력치와 장비', es: 'Equipo y atributos obtenidos cuando se alcanzó el nivel más alto', id: 'Status dan perlengkapan saat mencapai level tertinggi' },
  最高レベル: { ja: '最高レベル', en: 'Best LV', 'zh-Hant': '最高LV', 'zh-Hans': '最高LV', ko: '최고LV', es: 'NV mas alto', id: 'Mayor LV' },
  装備していません_スペース: { ja: '装備していません', en: 'E M P T Y', 'zh-Hant': 'E M P T Y', 'zh-Hans': 'E M P T Y', ko: 'E M P T Y', es: 'V A C Í O', id: 'E M P T Y' },
  'スロットをロック中..._スペース': { ja: 'スロットをロック中...', en: 'L O C K E D', 'zh-Hant': 'L O C K E D', 'zh-Hans': 'L O C K E D', ko: 'L O C K E D', es: 'B L O Q U E A D O', id: 'L O C K E D' },
  最高コンボ数: { ja: '最高コンボ数', en: 'Best Combo', 'zh-Hant': '最高Combo', 'zh-Hans': '最高Combo', ko: '최고Combo', es: 'Combo mas alto', id: 'Mayor Combo' },
  最高ダメージ: { ja: '最高ダメージ', en: 'Best Damage', 'zh-Hant': '最高Damage', 'zh-Hans': '最高Damage', ko: '최고Damage', es: 'Daño mas alto', id: 'Mayor Damage' },
  '面白ければぜひツイートや友達、': { ja: '面白ければぜひツイートや友達、', en: 'If you like this mod,Click the icon to join our discord server', 'zh-Hant': 'If you like this mod,Click the icon to join our discord server', 'zh-Hans': 'If you like this mod,Click the icon to join our discord server', ko: 'If you like this mod,Click the icon to join our discord server', es: 'If you like this mod,Click the icon to join our discord server', id: 'If you like this mod,Click the icon to join our discord server' },
  バックアップ: { ja: 'バックアップ', en: 'Backup', 'zh-Hant': '備份', 'zh-Hans': '备份', ko: '백업', es: 'Copia de seguridad', id: 'Cadangan' },
  復元: { ja: '復元', en: 'Restore', 'zh-Hant': '還原', 'zh-Hans': '复原', ko: '복원', es: 'Restauración', id: 'Restorasi' },
  'バックアップします。': { ja: 'バックアップします。', en: 'Back Up', 'zh-Hant': '進行備份', 'zh-Hans': '进行备份。', ko: '백업합니다.', es: 'Se hará una copia de seguridad', id: 'Cadangkan.' },
  '他の携帯でバックアップしたデータを復元します。': { ja: '他の携帯でバックアップしたデータを復元します。', en: 'Restore data backed up on another device', 'zh-Hant': '還原成備份在其他手機的資料。', 'zh-Hans': '复原其他手机上的备份数据。', ko: '다른 휴대폰에서 백업한 데이터를 복원합니다.', es: 'Restaurar los datos guardados en la copia de seguridad en otro dispositivo móvil.', id: 'Data cadangan akan direstorasi ke ponsel lain.' },
  バックアップ中です: { ja: 'バックアップ中です', en: 'Backing Up', 'zh-Hant': '備份中', 'zh-Hans': '备份中', ko: '백업중입니다', es: 'Haciendo copia de seguridad', id: 'Mencadangkan' },
  'バックアップが完了しました。': { ja: 'バックアップが完了しました。', en: 'Backup Complete', 'zh-Hant': '備份完成', 'zh-Hans': '备份完成', ko: '백업 완료', es: 'Copia de seguridad finalizada', id: 'Pencadangan selesai' },
  サインイン失敗: { ja: 'サインイン失敗', en: 'Log In Failed', 'zh-Hant': '登入失敗', 'zh-Hans': '登录失败', ko: '로그인 실패', es: 'Inicio de sesión fallido', id: 'Gagal masuk' },
  ログイン失敗: { ja: 'ログイン失敗', en: 'Log In Failed', 'zh-Hant': '登入失敗', 'zh-Hans': '登录失败', ko: '로그인 실패', es: 'Inicio de sesión fallido', id: 'Gagal masuk' },
  'バックアップが失敗しました。': { ja: 'バックアップが失敗しました。', en: 'Backup Failed', 'zh-Hant': '備份失敗', 'zh-Hans': '备份失败', ko: '백업 실패', es: 'Copia de seguridad fallida', id: 'Pencadangan gagal' },
  復元中です: { ja: '復元中です', en: 'Restoring', 'zh-Hant': '還原中', 'zh-Hans': '复原中', ko: '복원중입니다', es: 'Restaurando', id: 'Merestorasi' },
  '復元に成功しました。': { ja: '復元に成功しました。', en: 'Successfully Restored', 'zh-Hant': '還原成功', 'zh-Hans': '复原成功', ko: '복원 성공', es: 'Restauración con éxito', id: 'Restorasi berhasil' },
  '復元を中止しました。': { ja: '復元を中止しました。', en: 'Stop Restore', 'zh-Hant': '中止還原', 'zh-Hans': '复原中止', ko: '복원 중지', es: 'Interrumpir restauración', id: 'Restorasi terhenti' },
  'データが壊れています。': { ja: 'データが壊れています。', en: 'Data Corrupted', 'zh-Hant': '檔案有損壞。', 'zh-Hans': '数据毁坏。', ko: '데이터가 손상되었습니다.', es: 'Los datos están corruptos', id: 'Data rusak.' },
  'もう一度バックアップしてください。': { ja: 'もう一度バックアップしてください。', en: 'Please back up once more.', 'zh-Hant': '請再備份一次。', 'zh-Hans': '请重新备份。', ko: '다시 한 번 백업해주세요.', es: 'Por favor, haga de nuevo una copia de seguridad.', id: 'Harap cadangkan ulang.' },
  'バックアップデータがありません。': { ja: 'バックアップデータがありません。', en: 'No backup data.', 'zh-Hant': '沒有備份資料。', 'zh-Hans': '无备份数据。', ko: '백업 데이터가 없습니다.', es: 'No hay datos de copia de seguridad.', id: 'Tak ada data cadangan.' },
  'アプリのアップデートがあります。アップデートしてください。': { ja: 'アプリのアップデートがあります。アップデートしてください。', en: 'There is an app update. Please update.', 'zh-Hant': '應用程式有更新。請更新。', 'zh-Hans': '有可更新的应用。请更新。', ko: '앱 업데이트가 있습니다. 업데이트 해주세요.', es: 'Hay actualizaciones de la aplicación. Por favor, actualícela.', id: 'Tersedia pembaruan aplikasi. Harap perbarui.' },
  '復元に失敗しました。': { ja: '復元に失敗しました。', en: 'Restore Failed', 'zh-Hant': '還原失敗', 'zh-Hans': '复原失败', ko: '복원 실패', es: 'Fallos en la restauración', id: 'Restorasi gagal' },
  保存した日時: { ja: '保存した日時', en: 'Saved Date & Time', 'zh-Hant': '存檔時間', 'zh-Hans': '保存的日期', ko: '저장한 날짜', es: 'Fecha y hora guardadas', id: 'Waktu penyimpanan' },
  保存したバージョン: { ja: '保存したバージョン', en: 'Saved Version', 'zh-Hant': '存檔版本', 'zh-Hans': '已保存的版本', ko: '저장한 버전', es: 'Versión guardada', id: 'Versi yang tersimpan' },
  保存した装備の数: { ja: '保存した装備の数', en: 'Saved Equipment', 'zh-Hant': '存檔的裝備數', 'zh-Hans': '已保存的装备数量', ko: '저장한 장비 수', es: 'Número de equipos guardados', id: 'Jumlah peralatan yang tersimpan' },
  現在のバージョン: { ja: '現在のバージョン', en: 'Current Version', 'zh-Hant': '現在的版本', 'zh-Hans': '目前的版本', ko: '현재 버전', es: 'Versión actual', id: 'Versi saat ini' },
  現在の装備の数: { ja: '現在の装備の数', en: 'Current Equipments', 'zh-Hant': '現在的裝備數', 'zh-Hans': '目前的装备数量', ko: '현재 장비 수', es: 'Número de equipos actuales', id: 'Jumlah peralatan saat ini' },
  復元する: { ja: '復元する', en: 'Restore', 'zh-Hant': '還原', 'zh-Hans': '复原', ko: '복원한다', es: 'Restaurar', id: 'Restorasi' },
  復元しない: { ja: '復元しない', en: 'Cancel', 'zh-Hant': '取消', 'zh-Hans': '取消', ko: '취소', es: 'Cancelar', id: 'Batal' },
  '復元すると、現在のデータは消えます。': { ja: '復元すると、現在のデータは消えます。', en: 'The current data will be deleted if you restore.', 'zh-Hant': '還原後，現在的資料會消失。', 'zh-Hans': '一旦复原，将无法清除当前数据。', ko: '복원하시면 현재 데이터는 사라집니다.', es: 'Al actualizar se eliminarán los datos actuales.', id: 'Restorasi akan menghapus data saat ini.' },
  チュートリアル: { ja: 'チュートリアル', en: 'Tutorial', 'zh-Hant': 'Tutorial', 'zh-Hans': 'Tutorial', ko: 'Tutorial', es: 'Tutorial', id: 'Tutorial' },
  チュートリアル1_1: { ja: 'チュートリアル1_1', en: 'In this game, you can fight up to 30 battles. When your remaining Battle Points reach 0, the game ends. Gain as many levels as possible before the game ends!', 'zh-Hant': '歡迎來到Bean RPG！玩家只能進行30次的戰鬥。當您剩餘的戰鬥次數(BATTLE POINT)歸零時遊戲就結束了。在遊戲結束之前，盡全力提升等級吧！', 'zh-Hans': '欢迎来到Bean RPG！最多只能进行30次战斗。剩下的战斗次数(BATTLE POINT)消耗光后游戏结束。游戏结束为止尽量提升等级吧！', ko: 'BeanRPG에 오신 것을 환영합니다！전투는 30회로 한정됩니다. 나머지 전투횟수(BATTLE POINT)가 모두 소진되면 게임 오버가 됩니다.게임 오버가 될 때까지 할 수 있는 한 레벨을 올리자！', es: '¡Bienvenido a Bean RPG! Solo podrás combatir un máximo de 30 veces. Cuando se acaben los Puntos de Combate (BATTLE POINTS), se terminará la partida. ¡Intenta subir de nivel todo lo que puedas antes de que se acabe la partida!', id: 'Selamat datang di Bean RPG!Hanya dapat bermain sampai dengan 30 kali. Apabila kehilangan sisa jumlah bermain maka akan game over. Ayo tingkatkan levelnya sebelum game over!' },
  チュートリアル1_2: { ja: 'チュートリアル1_2', en: 'When you first start, you won\'t be able to beat enemies in areas suitable for higher leveled characters, so be careful!', 'zh-Hant': '開始的時候，超過適合LV場地裡的敵人可是很難戰勝的，請特別注意這點！', 'zh-Hans': '刚开始的时候在适当LV之上的地方战斗的话一般是不太容易打赢敌人的，请注意！', ko: '초반은 적정LV 이상의 장소에서는 적에게 이기는 것이 어려우므로 주의가 필요합니다!', es: 'Al principio, ten cuidado. Es muy difícil vencer a los enemigos en lugares con un nivel apto mayor que el tuyo.', id: 'Utk pemula, bermainlah di tempat yang telah ditentukan. Apabila bertempur ditempat yang lebih tinggi akan sulit mengalahkan lawan!' },
  チュートリアル2_1: { ja: 'チュートリアル2_1', en: 'Congratulations on leveling up! Distribute the Stat Points gained from leveling up to make your character stronger!\n\nYour character\'s strength can be increased through the Menu button on the upper right.', 'zh-Hant': '恭禧升級！將升級之後取得的能力點數進行分配，並強化人物角色吧！\n\n若要強化能力値可從右上角的MENU鈕進行設定。', 'zh-Hans': '恭喜你升级！升级后得到的人物属性点来强化玩家吧！\n\n强化属性请点击右上角的MENU按钮。', ko: '레벨업을 축하합니다! 레벨업하여 손에 넣은 스테이터스 포인트를 나누어 플레이어를 강화하자!\n\n스테이터스를 강화하기 위해서는 우측 상단의 MENU버튼에서 가능합니다.', es: 'Has subido de nivel, ¡enhorabuena! ¡Haz que tu personaje sea más poderoso distribuyendo los Puntos de Atributo que has conseguido!\n\nPodrás incrementar tus atributos pulsando el botón Menú en la parte superior derecha.', id: 'Selamat!Karena sudah naik level, ayo bagikan kekuatannya Status Point\n\nUtk kekuatannya ada di tombol sebelah kanan atas MENU' },
  チュートリアル3_1: { ja: 'チュートリアル3_1', en: 'Try moving away from the beginner level area! Going down is recommended when moving around for the first time.', 'zh-Hant': '由最初的適合LV範圍開始移動！\n首先建議先移動至下方。', 'zh-Hans': '从一开始的适当LV范围移动吧！\n首先推荐移动到下面的方向。', ko: '최초의 적정LV의 범위로부터 이동하자！\n우선은 아래 방향으로 이동하는 것을 추천합니다.', es: '¡Hora de salir del área con el NV APTO inicial!\nTe recomiendo que te dirijas hacia abajo.', id: 'Awalnya mari kita berpindah LVTepat yang paling baik untuk awalnya adalah gerak ke bawah' },
  チュートリアル4_1: { ja: 'チュートリアル4_1', en: 'Since you have gained some money, how about buying some weapons? The character can be made stronger by equipping weapons and armor. Equipment carries over into the next game, so get some if you can!', 'zh-Hant': '獲得了金錢，拿去購買武器吧！\n裝備上武器及防具之後可以更加強化人物角色。\n\n裝備可以續用到下次戰鬥，儘可能地充實各項裝備吧！', 'zh-Hans': '得到了金钱后试着买武器吧！\n装备武器和防具后玩家会更加得到强化。\n\n装备可以在下一个游戏里得到继承，尽量得到吧！', ko: '돈을 획득했으므로 무기를 사보자！\n무기나 방어구를 장비하면 플레이어를 더욱 강화하는 것이 가능합니다.\n\n장비은 다음의 게임에도 계속하는 것이 가능하므로 가능한 한 손에 넣자！', es: 'Has conseguido dinero, ¿por qué no compras armas?\nAl equipar armas o armaduras, podrás hacer que tu personaje sea aún más poderoso.\n\nComo conservas las armas y las armaduras en la siguiente partida, podrás tener unos atributos muy altos nada más empezar.', id: 'Karena sdh mendapatkan uang, jadi sebaiknya belikan senjata!\n\nApabila membeli senjata, equipment dll akan dapat menambah kekuatan.' },
  名無し: { ja: '名無し', en: 'Nameless', 'zh-Hant': 'Nameless', 'zh-Hans': 'Nameless', ko: 'Nameless', es: 'Sin Nombre', id: 'Nameless' },
  'ランキングで使う名前を入力し': { ja: 'ランキングで使う名前を入力し', en: 'Name setting', 'zh-Hant': '變更使用者名稱', 'zh-Hans': '改变用户名', ko: '이름 변경', es: 'Cambio de nombre', id: 'Perbaharui nama' },
  名前変更: { ja: '名前変更', en: 'Change Name', 'zh-Hant': '變更使用者名稱', 'zh-Hans': '改变用户名', ko: '이름 변경', es: 'Cambio de nombre', id: 'Perbaharui nama' },
  'しばらくお待ちください。': { ja: 'しばらくお待ちください。', en: 'Please wait a moment.', 'zh-Hant': '请耐心等待。', 'zh-Hans': '請稍候。', ko: '잠시만 기다려 주십시오.', es: 'Espera un momento, por favor.', id: 'Mohon tunggu sebentar.' },
  '参加条件:[0]LV以上': { ja: '参加条件:[0]LV以上', en: 'Conditions: [0]LV', 'zh-Hant': '參加條件：[0]LV以上', 'zh-Hans': '参加条件 : [0]LV以上', ko: '참가 조건: [0]LV 이상', es: 'Condiciones: [0]LV o más', id: 'Syarat bergabung: [0]LV' },
  通信エラー: { ja: '通信エラー', en: 'Error', 'zh-Hant': 'Error', 'zh-Hans': 'Error', ko: 'Error', es: 'Error', id: 'Error' },
  'エラーが発生しました。': { ja: 'エラーが発生しました。', en: 'Error', 'zh-Hant': 'Error', 'zh-Hans': 'Error', ko: 'Error', es: 'Error', id: 'Error' },
  リアルタイムランキング: { ja: 'リアルタイムランキング', en: 'Real-time rankings', 'zh-Hant': '即時排行榜', 'zh-Hans': '实时排名', ko: '실시간 순위', es: 'Clasificación en tiempo real', id: 'Real-time Ranking' },
  適正レベル: { ja: '適正レベル', en: 'AREA LV', 'zh-Hant': '適合LV', 'zh-Hans': '适合LV', ko: '적정 LV', es: 'NV APTO', id: 'LV Tepat' },
  ボーナス_マップ上: { ja: 'ボーナス', en: 'Bonus', 'zh-Hant': '獎勵', 'zh-Hans': '奖励', ko: '보너스', es: 'Bonus', id: 'Bonus' },
  敵のHP半減: { ja: '敵のHP半減', en: 'Enemy HP x[0]', 'zh-Hant': 'Enemy HP x[0]', 'zh-Hans': 'Enemy HP x[0]', ko: 'Enemy HP x[0]', es: 'HP enemigo x[0]', id: 'Enemy HP x[0]' },
  敵の攻撃力半減: { ja: '敵の攻撃力半減', en: 'Enemy ATK x[0]', 'zh-Hant': 'Enemy ATK x[0]', 'zh-Hans': 'Enemy ATK x[0]', ko: 'Enemy ATK x[0]', es: 'ATK enemigo x[0]', id: 'Enemy ATK x[0]' },
  会心連続率上昇: { ja: '会心連続率上昇', en: '+ Combo & Crit', 'zh-Hant': '连击暴击率上升', 'zh-Hans': '连击暴击率上升', ko: '+ Combo & Crit', es: '+ Combo & Crit', id: '+ Combo & Crit' },
  '獲得コイン[0]倍': { ja: '獲得コイン[0]倍', en: 'Money x[0]', 'zh-Hant': 'Money x[0]', 'zh-Hans': 'Money x[0]', ko: 'Money x[0]', es: 'Dinero x[0]', id: 'Money x[0]' },
  '経験値[0]倍': { ja: '経験値[0]倍', en: 'EXP x[0]', 'zh-Hant': 'EXP x[0]', 'zh-Hans': 'EXP x[0]', ko: 'EXP x[0]', es: 'EXP x[0]', id: 'EXP x[0]' },
  'ここは適正レベル[0]で': { ja: 'ここは適正レベル[0]です', en: 'This area is LV :[0]', 'zh-Hant': '這裡是適合[0]LV', 'zh-Hans': '这里是适合[0]LV', ko: '여기는 적정 [0]LV 입니다', es: 'Esta área es de NV [0]', id: 'Di sini Tepat[0]LV' },
  'ベース能力[0]LVにステータス倍率ボーナス加算': { ja: 'ベース能力[0]LVにステータス倍率ボーナス加算', en: 'Your Base Ability has become [0]LV!\n\nA multiplier bonus will be added to your status value that is as high as the total of Base Ability LV and Character Ability LV.', 'zh-Hant': '基本能力升到[0]LV了!\n\n基本能力LV與角色能力LV合計越高素質值就會有倍數加成', 'zh-Hans': '天赋变成[0]LV了!\n\n天赋和角色能力的合计越高，数据值的倍率额外奖励会增加更多', ko: '베이스 능력가 [0]레벨이 되었습니다!\n\n베이스 능력와 캐릭터 능력의 합계가 높을 수록 스테이터스 수치에 배율 보너스가 가산됩니다', es: '¡Tu Habilidad Base es ahora de [0]NV!\n\nCuanto más alta sea la suma de tu Habilidad Base y tu Habilidad de Personaje recibirás una bonificación mayor a tus atributos', id: 'Kemampuan dasar mencapai Level [0]!\n\nSemakin tinggi jumlah total kemampuan dasar dan kemampuan karakter, semakin berlipat-ganda bonus yang ditambahkan pada nilai status' },
  'ステータス振り分け画面を開きますか?': { ja: 'ステータス振り分け画面を開きますか?', en: 'Will you open the stat allocation menu?', 'zh-Hant': '要開啟分配能力値畫面嗎?', 'zh-Hans': '打开属性分配界面吗?', ko: '스테이터스 배분 화면를 열까요?', es: 'Abrir el menú de atributos?', id: 'Tampilkan layar menu status？' },
  ボーナス_マップボタン: { ja: 'ボーナス', en: 'Bonus', 'zh-Hant': '獎勵', 'zh-Hans': '奖励', ko: '보너스', es: 'Bonus', id: 'Bonus' },
  エンカウント: { ja: 'エンカウント', en: 'Encounter', 'zh-Hant': '戰鬥', 'zh-Hans': '战斗', ko: '엔카운트', es: 'Encuentro', id: 'Encounter' },
  メニュー: { ja: 'メニュー', en: 'Menu', 'zh-Hant': '選單', 'zh-Hans': '菜单', ko: '메뉴', es: 'Menú', id: 'Menu' },
  '装備SET[0]': { ja: '[0]', en: '[0]', 'zh-Hant': '[0]', 'zh-Hans': '[0]', ko: '[0]', es: '[0]', id: '[0]' },
  '適正LV:[0]': { ja: '適正LV:[0]', en: 'AREA LV:[0]', 'zh-Hant': '適合LV : [0]', 'zh-Hans': '适合LV : [0]', ko: '적정 LV : [0]', es: 'NV APTO : [0]', id: 'LV Tepat :[0]' },
  現在のマップ情報: { ja: '現在のマップ情報', en: 'Current map information', 'zh-Hant': '目前的地圖資訊', 'zh-Hans': '现在的地图信息', ko: '현재 지도 정보', es: 'Información del mapa actual', id: 'Informasi peta saat ini' },
  'ゲージ高いほど敵と遭遇しやすく': { ja: 'ゲージが高いほど敵と遭遇しやすくなります', en: 'The higher the gauge, the more likely you will be met with an enemy', 'zh-Hant': '量表越高就越容易遭遇敵人', 'zh-Hans': '槽越高越容易与敌人相遇', ko: '게이지가 높을 수록 적과 만날 가능성이 높습니다', es: 'Cuanto más suba la barra, más fácil será que se produzca un encuentro', id: 'Semakin tinggi tembakan, semakin mudah menghadapi musuh' },
  エンカウントゲージ: { ja: 'エンカウントゲージ', en: 'Encounter Gauge', 'zh-Hant': 'Encounter Gauge', 'zh-Hans': 'Encounter Gauge', ko: 'Encounter Gauge', es: 'Barra de Encuentro', id: 'Encounter Gauge' },
  レベル: { ja: 'レベル', en: 'Level', 'zh-Hant': 'Level', 'zh-Hans': 'Level', ko: 'Level', es: 'Level', id: 'Level' },
  次のLVまで: { ja: '次のLVまで', en: 'Next Level ', 'zh-Hant': 'Next Level ', 'zh-Hans': 'Next Level ', ko: 'Next Level ', es: 'Siguiente Nivel ', id: 'Next Level ' },
  '[0]Gを獲得しました。': { ja: '[0]Gを獲得しました。', en: 'Obtained [0]G', 'zh-Hant': '獲得[0]G', 'zh-Hans': '获得了[0]G', ko: '[0]G를 획득하였습니다.', es: 'Has obtenido [0]G', id: 'Mendapat [0]G' },
  '現在いるマップ全体にボーナスを追加します。': { ja: '現在いるマップ全体にボーナスを追加します。', en: 'Bonuses will be added all over the map you are currently on.', 'zh-Hant': '現在所在的全地圖追加獎金。', 'zh-Hans': '现在所在的全地图追加Bonus', ko: '현재 위치한 지도 전체에 보너스를 추가합니다.', es: 'Se añadirán bonus por todo el mapa actual.', id: 'Bonus ditambahkan pada seluruh peta yang ada' },
  'お金をランダムで獲得します。\nこの': { ja: 'お金をランダムで獲得します。\nこのボーナスは使用回数が多いほど獲得量が増えます。', en: 'Clear the map bonus', 'zh-Hant': '清除地图bonus', 'zh-Hans': '可以用来清除地图的Bonus\n', ko: '금화를 랜덤으로 획득할 수 있습니다.\n이 보너스는 사용 회수가 많을수록 획득량이 늘어납니다.', es: 'Obtendrás dinero de forma aleatoria. A medida que usas el bonus, la cantidad obtenida aumentará.', id: 'Uang didapatkan secara acak. Jumlah yang didapatkan semakin bertambah jika semakin banyak menggunakan bonus' },
  '残り使用回数 [0]回': { ja: '残り使用回数 [0]回', en: '', 'zh-Hant': '', 'zh-Hans': '', ko: '남은 사용 회수 [0]회', es: 'Usos restantes: [0]', id: 'Sisa penggunaan [0] kali' },
  'このゲームに使用できる回数 [0]回': { ja: 'このゲームに使用できる回数 [0]回', en: 'Number of times available for use in this game: [0]', 'zh-Hant': '可以用在此戰鬥的次數[0]次', 'zh-Hans': '可以用在此战斗中的次数为[0]次', ko: '이 게임에 사용할 수 있는 회수 [0]회', es: 'Veces que puedes usarlos en esta partida: [0]', id: 'Maksimal penggunaan pada permainan ini [0] kali' },
  '一日に合計[0]回使用できます。': { ja: '一日に合計[0]回使用できます。', en: 'Can be used a total of [0] times per day.', 'zh-Hant': '1天合計共可使用[0]次。', 'zh-Hans': '1天可累计使用[0]次。', ko: '하루에 총 [0]회 사용할 수 있습니다.', es: 'N.º total de usos posibles cada día: [0]', id: 'Dalam sehari bisa menggunakan [0] kali' },
  '同じゲームでは[0]回までしか使用出来ません。': { ja: '同じゲームでは[0]回までしか使用出来ません。', en: 'Can be used no more than [0] times in the same game.', 'zh-Hant': '同一場戰鬥裡最多只可使用[0]次。', 'zh-Hans': '同一游戏中仅限使用[0]次。', ko: '같은 게임에서는 [0]회까지만 사용할 수 있습니다.', es: 'N.º máximo de usos durante la misma partida: [0]', id: 'Hanya bisa menggunakan [0] kali pada permainan yang sama' },
  '今までの合計使用回数 [0]回': { ja: '今までの合計使用回数 [0]回', en: 'Total number of uses so far: [0]', 'zh-Hant': '目前已累计使用[0]次', 'zh-Hans': '目前已累计使用[0]次', ko: '지금까지 총 사용 회수 [0]회', es: 'Número total de usos hasta ahora: [0]', id: 'Penggunaan sampai saat ini [0] kali' },
  '一日に1回しか使同じゲームに2回以上使': { ja: '一日に1回しか使用出来ません。\n同じゲームに2回以上使用出来ません。', en: '', 'zh-Hant': '', 'zh-Hans': '', ko: '하루에 1회만 사용할 수 있습니다.\n같은 게임에서는 2회까지만 사용할 수 있습니다.', es: 'Solo los puedes usar 1 veces cada día.\nN.º máximo de usos durante la misma partida: 2', id: 'Hanya bisa menggunakan 1 kali dalam 1 hari.\nHanya bisa menggunakan 2 kali pada permainan yang sama' },
  'このゲームではもう使用できません。': { ja: 'このゲームではもう使用できません。', en: '', 'zh-Hant': '', 'zh-Hans': '', ko: '', es: '', id: '' },
  使用: { ja: '使用', en: 'Use', 'zh-Hant': '使用', 'zh-Hans': '使用', ko: '사용', es: 'Usar', id: 'Gunakan' },
  メニュー画面: { ja: 'メニュー画面', en: 'Main Manu', 'zh-Hant': '主選單', 'zh-Hans': '主菜单', ko: '메인 메뉴', es: 'Menú principal', id: 'Menu Utama' },
  ステータス振り分: { ja: 'ステータス振り分け', en: 'Stats', 'zh-Hant': '能力値', 'zh-Hans': '属性', ko: '스테이터스', es: 'Atributos', id: 'Status' },
  ステータス振り分け: { ja: 'ステータス振り分け', en: 'Stats', 'zh-Hant': '能力値', 'zh-Hans': '属性', ko: '스테이터스', es: 'Atributos', id: 'Status' },
  'ステスポイの振り分けを行うことが': { ja: 'ステータスポイントの振り分けを行うことができます。', en: 'Allows you to see \nthe stat details and allocate your Stat Points.', 'zh-Hant': '可以查看能力値的詳細內容，分配能力點數', 'zh-Hans': '可以查看属性详情，分配属性点', ko: '상태정보를 볼 수 있으며\n스테이터스 포인트을 배분합니다.', es: 'Te permite ver información detallada sobre\natributos y distribuir los Puntos de Atributo.', id: 'Melihat rincian status dan membagi Stat Point' },
  装備: { ja: '装備', en: 'Equipment', 'zh-Hant': '裝備', 'zh-Hans': '装备', ko: '장비', es: 'Equipo', id: 'Peralatan' },
  'アイテムを購入、装備をし': { ja: 'アイテムを購入、装備をします。', en: 'Buy and equip items.', 'zh-Hant': '購買、裝上裝備', 'zh-Hans': '购买装备，进行装备', ko: '장비를 구입하여, 장비합니다.', es: 'Comprar y equipar objetos.', id: 'Beli dan gunakan item.' },
  'ゲームの設定などを変更しま': { ja: 'ゲームの設定などを変更します。', en: 'Change the game and language settings.', 'zh-Hant': '變更遊戲和語言的設定等等', 'zh-Hans': '更改游戏和语言设定等', ko: '게임 및 언어설정 등을 변경합니다.', es: 'Cambia los ajustes de juego y de idioma.', id: 'Ubah setelan permainan dan bahasa' },
  'ゲームは自動的にセーブされて': { ja: 'ゲームは自動的にセーブされています。', en: 'The game saves automatically.', 'zh-Hant': '遊戲會自動進行儲存', 'zh-Hans': '游戏自动保存', ko: '게임은 자동적으로 저장됩니다.', es: 'La partida se guardará automáticamente.', id: 'Permainan secara otomatis tersimpan' },
  タイトルに戻る: { ja: 'タイトルに戻る', en: 'Title', 'zh-Hant': '主畫面', 'zh-Hans': '标题', ko: '타이틀', es: 'Inicio', id: 'Judul' },
  '本当にタイトルに戻りますか？': { ja: '本当にタイトルに戻りますか？', en: 'Return to the title?', 'zh-Hant': '要回到標題畫面嗎?', 'zh-Hans': '返回标题吗?', ko: '타이틀로 돌아가시겠습니까?', es: '¿Quieres volver a la pantalla de inicio?', id: 'Kembali ke judul?' },
  'ステポを振り分けると強化することが': { ja: 'ステータスポイントを振り分けるとステータスを\n　　　　　　　　　　　　　　　　強化することができます。', en: '\nYou can increase your stats by distributing your Stat Points.', 'zh-Hant': '\n只要分配能力點數就可以強化素質', 'zh-Hans': '\n将属性点分配后，可以强化属性', ko: '스테이터스 포인트를 분배하면\n스테이터스를 강화하는 것이 가능합니다 ', es: 'Puedes subir tus atributos\ndistribuyendo los Puntos de Atributo', id: '\nStatus dapat diperkuat dengan membagi Stat Point' },
  '連続クリティカルは素早さ依存しま': { ja: '連続攻撃、クリティカル率は素早さに依存します。', en: 'Combo attack and critical rate depend on AGI.', 'zh-Hant': 'AGI影響連續攻擊、必殺率', 'zh-Hans': '连击、暴击率取决于AGI', ko: '연속공격、크리티컬률은 AGI에 의존', es: 'Las combinaciones de ataques y el porcentaje de críticos dependen de la AGI', id: 'Serangan beruntun dan rasio kritis tergantung pada AGI' },
};

export const getTranslation = (key: string, lang: LanguageCode): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  return translation[lang] || key;
};

export const getLanguageName = (code: LanguageCode): string => {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang?.name['zh-Hans'] || code;
};