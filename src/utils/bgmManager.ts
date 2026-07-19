/**
 * BGM 管理器
 *
 * 模拟原版 SeBgm 类的 bgmstartf(category, subId) / bgmstopf() 接口。
 *
 * 参考实现（data/txt/）：
 *   - title.txt:    `ga.sebgm.bgmstartf(0)`              → 标题画面
 *   - StageMap.txt: `ga.sebgm.bgmstartf(3, MapNum)`       → 地图画面
 *   - battle.txt:   `ga.sebgm.bgmstartf(5, BossSyu)`      → 战斗开始（BossSyu>=0 为Boss战）
 *   - battle.txt:   `ga.sebgm.bgmstartf(7, BossSyu)`      → 战斗胜利
 *   - gameover.txt: `ga.sebgm.bgmstartf(15)`              → 游戏结束
 *
 * public/sounds/ 文件命名规则：`{num}_{type}_bgm.mp3`
 *   3_battle1 / 4_battle2 / 5_battle3 / 6_boss1 / 7_gameover
 *   8_map1 ~ 14_map7 / 917_map8 / 1015_map9
 *   15_title / 16_win1
 *
 * 战斗 BGM 选择规则（参考 battle.txt#L196-199）：
 *   - BossSyu >= 0：播放 6_boss1_bgm.mp3
 *   - BossSyu <  0：从 3/4/5 battle BGM 中随机选择一首
 */

const SOUND_BASE = `${import.meta.env.BASE_URL}sounds`;

// category → 文件名映射
const BGM_FILES: Record<number, string> = {
  0: '15_title_bgm.mp3',
  7: '16_win1_bgm.mp3',
  15: '7_gameover_bgm.mp3',
};

// 地图 BGM: subId (MapNum) → 文件名
const MAP_BGM_FILES: Record<number, string> = {
  1: '8_map1_bgm.mp3',
  2: '9_map2_bgm.mp3',
  3: '10_map3_bgm.mp3',
  4: '11_map4_bgm.mp3',
  5: '12_map5_bgm.mp3',
  6: '13_map6_bgm.mp3',
  7: '14_map7_bgm.mp3',
  8: '917_map8_bgm.mp3',
  9: '1015_map9_bgm.mp3',
};

// 普通战斗 BGM 候选
const NORMAL_BATTLE_BGM = [
  '3_battle1_bgm.mp3',
  '4_battle2_bgm.mp3',
  '5_battle3_bgm.mp3',
];

// Boss 战 BGM
const BOSS_BATTLE_BGM = '6_boss1_bgm.mp3';

// SE 文件名映射
const EF_SE_FILES: Record<number, string> = {
  1: '65_ef1_se.mp3',
  2: '66_ef2_se.mp3',
  3: '67_ef3_se.mp3',
  4: '68_ef4_se.mp3',
  5: '69_ef5_se.mp3',
};
const OK_SE = '73_ok_se.mp3';
const LVUP_SE = '71_lvup_se.mp3';
const KAIHUKU_SE = '70_kaihuku_se.mp3';

class BgmManager {
  private audio: HTMLAudioElement | null = null;
  private currentCategory: number = -1;
  private currentSubId: number = -1;
  /** BGM 总开关（对应原版 ga.sebgm.bgm） */
  public bgmEnabled: boolean = true;
  /** 音量（0-1） */
  public volume: number = 0.4;
  /** 上一次普通战斗 BGM 索引，避免连续重复 */
  private lastNormalBattleIdx: number = -1;
  /** 用户是否已交互过 */
  private userInteracted: boolean = false;
  /** 等待用户交互后重试的播放请求 */
  private pendingPlay: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const onInteract = () => {
        this.userInteracted = true;
        if (this.pendingPlay) {
          this.pendingPlay();
          this.pendingPlay = null;
        }
        // 清除所有交互事件监听
        ['click', 'keydown', 'touchstart'].forEach((evt) => {
          document.removeEventListener(evt, onInteract);
        });
      };
      ['click', 'keydown', 'touchstart'].forEach((evt) => {
        document.addEventListener(evt, onInteract, { once: false });
      });
    }
  }

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = this.volume;
    }
    return this.audio;
  }

  /** 是否允许播放（受开关与浏览器策略影响） */
  private canPlay(): boolean {
    if (!this.bgmEnabled) return false;
    if (typeof window === 'undefined') return false;
    return true;
  }

  /**
   * 播放 BGM
   * @param category 0=标题, 3=地图, 5=战斗, 7=胜利, 15=游戏结束
   * @param subId    对于 3=MapNum, 对于 5/7=BossSyu（>=0 为Boss战），其余忽略
   */
  public bgmstartf(category: number, subId: number = -1): void {
    if (!this.canPlay()) return;

    let fileName: string | null = null;

    if (category === 5) {
      // 战斗 BGM
      if (subId >= 0) {
        fileName = BOSS_BATTLE_BGM;
      } else {
        // 普通战斗：随机选择一首，避免与上次相同
        let idx = Math.floor(Math.random() * NORMAL_BATTLE_BGM.length);
        if (NORMAL_BATTLE_BGM.length > 1 && idx === this.lastNormalBattleIdx) {
          idx = (idx + 1) % NORMAL_BATTLE_BGM.length;
        }
        this.lastNormalBattleIdx = idx;
        fileName = NORMAL_BATTLE_BGM[idx];
      }
    } else if (category === 3) {
      // 地图 BGM
      fileName = MAP_BGM_FILES[subId] || MAP_BGM_FILES[1];
    } else {
      fileName = BGM_FILES[category] || null;
    }

    if (!fileName) return;

    // 同一首 BGM 不重复启动
    if (this.currentCategory === category && this.currentSubId === subId && this.audio && !this.audio.paused) {
      return;
    }

    const audio = this.ensureAudio();
    audio.pause();
    audio.src = `${SOUND_BASE}/${fileName}`;
    audio.currentTime = 0;
    audio.volume = this.volume;
    audio.loop = category !== 7; // 胜利 BGM 只播放一次

    const doPlay = () => {
      audio.play().catch((err) => {
        // 自动播放策略阻止时，等待用户交互后重试
        if (err.name === 'NotAllowedError' && !this.userInteracted) {
          this.pendingPlay = doPlay;
          console.warn('[BGM] 等待用户交互后播放');
        } else {
          console.warn('[BGM] 播放失败:', err?.message || err);
        }
      });
    };

    if (this.userInteracted) {
      doPlay();
    } else {
      // 还没交互过，直接尝试播放；被拦截则等待交互
      this.pendingPlay = doPlay;
      doPlay();
    }

    this.currentCategory = category;
    this.currentSubId = subId;
  }

  /** 停止 BGM */
  public bgmstopf(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.currentCategory = -1;
    this.currentSubId = -1;
  }

  /** 切换 BGM 开关 */
  public setBgmEnabled(enabled: boolean): void {
    this.bgmEnabled = enabled;
    if (!enabled) {
      this.bgmstopf();
    }
  }

  /** 设置音量 */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  /** 应用关闭时调用（对应原版 appOff） */
  public appOff(): void {
    this.bgmstopf();
  }

  /** 播放一段 SE（音效），允许重叠播放 */
  private playSE(fileName: string): void {
    if (!this.bgmEnabled || typeof window === 'undefined') return;
    try {
      const se = new Audio(`${SOUND_BASE}/${fileName}`);
      se.volume = this.volume;
      se.play().catch(() => {}); // SE 失败静默
      // 播放完成后自动释放
      se.addEventListener('ended', () => { se.remove(); });
    } catch {
      // ignore
    }
  }

  /** 玩家攻击/技能音效 */
  public myef(SkNum: number): void {
    const idx = ((SkNum - 1) % 5) + 1;
    this.playSE(EF_SE_FILES[idx]);
  }

  /** 敌人攻击/技能音效 */
  public eneef(SkNum: number): void {
    const idx = ((SkNum - 1) % 5) + 1;
    this.playSE(EF_SE_FILES[idx]);
  }

  /** 确认音效 */
  public okstart(): void {
    this.playSE(OK_SE);
  }

  /** 升级音效 */
  public lvupstart(): void {
    this.playSE(LVUP_SE);
  }

  /** 回复音效 */
  public kaihukustart(): void {
    this.playSE(KAIHUKU_SE);
  }
}

// 单例
export const bgmManager = new BgmManager();
