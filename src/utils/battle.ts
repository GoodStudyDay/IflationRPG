import type { Player, Enemy, BattleState } from '@/types';
import { battleVarInit } from './battleVar';
import { GDataBonuses } from './gdata';

export class Battle {
  private kaihukuNextTurnOn: boolean = false;
  private whichTurn: number = 0;
  private TurnEndCount: number = 0;
  private myTurnEndCount: number = 0;
  private eefi: number = 0;
  private tdame: number = 0;
  private crih: boolean = false;
  private mode: number = 1000;
  private getExpNokori: number = 0;
  private getExp: number = 0;
  private lvupsitanum: number = 0;

  public buffCount: number = 0;
  public buffCount2: number = 0;
  public eneHP2: number = 0;
  public eneATK2: number = 0;
  public patternCount: number = 0;
  public turnCount: number = 0;
  public eneHPM2: number = 0;
  public teneATK: number = 1;
  public eneDouble: number = 100;
  public eneSkill: number = 100;
  public eneDamageReduced: number = 1;
  public resSwitch: number = 0;
  public mySkillKakuritu: number = 0;
  public eneCounter: number = 0;
  public AdditionalDamage: number = 0;
  private phase: number = 0;

  private player: Player | null = null;
  private enemy: Enemy | null = null;
  private battleState: BattleState | null = null;
  private gdata: GDataBonuses | null = null;
  private hardmode: number = 0;

  private renzokukaisu: number = 1;
  private renzoKukakuritu: number = 0;
  private criKakuritu: number = 0;
  private enePoint: number = 0;

  constructor() {}

  public start_new(
    player: Player,
    enemy: Enemy,
    battleState: BattleState,
    gdata: GDataBonuses,
    hardmode: number
  ): void {
    this.player = player;
    this.enemy = enemy;
    this.battleState = battleState;
    this.gdata = gdata;
    this.hardmode = hardmode;

    this.mode = 1000;
    this.kaihukuNextTurnOn = false;
    this.whichTurn = 0;
    this.TurnEndCount = 0;
    this.myTurnEndCount = 0;
    this.renzokukaisu = 1;
    this.eneHP2 = 0;
    this.eneCounter = 100;
    this.eneSkill = 100;
    this.mySkillKakuritu = 100;
    this.turnCount = 0;
    this.patternCount = 0;
    this.resSwitch = 0;

    this.eneDamageReduced = 1;
    this.eneDouble = 100;
    this.eneCounter = 100;
    this.eneHP2 = 0;
    this.AdditionalDamage = 0;
    this.eneSkill = 100;
    this.turnCount = 0;
    this.patternCount = 0;
    this.resSwitch = 0;
    this.mySkillKakuritu = 100;

    const battleVarResult = battleVarInit(
      {
        hp: player.hp,
        maxHp: player.maxHp,
        attack: player.attack,
        defense: player.defense,
        agility: player.agility,
        luck: player.luck,
      },
      {
        hp: enemy.hp,
        attack: enemy.attack,
        exp: enemy.expReward,
        gold: enemy.goldReward,
        level: enemy.level,
      },
      enemy.drops.filter(d => d !== null).length,
      {
        hardmode,
        renzokuPlusKakuritu: gdata.renzokuPlusKakuritu || 0,
        crihPlusKakuritu: gdata.crihPlusKakuritu || 0,
        speedwariai: gdata.speedwariai || 0,
        lukwariai: gdata.lukwariai || 0,
        hourGlassON: false,
        hourGlassON1: false,
        expbairitu: gdata.expbairitu || 1,
        missrate: gdata.missrate || 0,
        enemissrate: gdata.enemissrate || 0,
      }
    );

    this.renzoKukakuritu = battleVarResult.comboRate;
    this.criKakuritu = battleVarResult.critRate;
  }

  public startFormat(): void {
    this.eneDamageReduced = 1;
    this.eneDouble = 100;
    this.eneCounter = 100;
    this.eneHP2 = 0;
    this.AdditionalDamage = 0;
    this.eneSkill = 100;
    this.turnCount = 0;
    this.patternCount = 0;
    this.resSwitch = 0;
    this.mySkillKakuritu = 100;
    this.eefi = 0;
    this.mode = 1000;
  }

  public EEF(): void {
    if (this.mode >= 1000 && this.mode <= 1010) {
      if (this.mode === 1000) {
        this.eefi++;
        if (this.eefi >= 13) {
          this.mode = 1001;
        }
      }
    } else if (this.mode === 777) {
      this.eefi++;
      if (this.eefi >= 13) {
        this.mode = 1;
      }
    } else if (this.mode >= 1 && this.mode <= 20) {
      this.EEFBattleFunc();
    } else if (this.mode >= 100 && this.mode <= 140) {
      this.EEFWinResultFunc();
    } else if (this.mode >= 150 && this.mode <= 190) {
      this.EEFLoseResultFunc();
    }
  }

  private EEFBattleFunc(): void {
    this.mySkillKakuritu = Math.random() * 100;

    if (this.mode === 1) {
      this.mode = 3;
    } else if (this.mode >= 3 && this.mode <= 5) {
      if (this.mode === 3) {
        if (this.whichTurn === 0) {
          this.myGetDameSkNumFunc();
        } else if (this.whichTurn === 1) {
          this.eneGetDameSkNumFunc();
        }
        this.eefi = 0;
        this.mode = 4;
      } else if (this.mode === 4) {
        if (this.renzokukaisu >= 2) {
          this.renzokuFunc();
        }
        if (this.eefi >= 5) {
          this.applyDamage();
          this.enePattern(this.battleState?.bossType || -1);
          this.mode = 5;
        }
      } else if (this.mode === 5) {
        if (this.eefi >= 2) {
          this.TurnEndCount++;
          if (this.whichTurn === 0) {
            this.myTurnEndCount++;
            if (this.enemy && this.enemy.hp > 0) {
              const comboRate = this.getComboRate();
              if (Math.random() <= comboRate) {
                this.whichTurn = 0;
                this.renzokukaisu++;
              } else {
                this.eneDouble = Math.random() * 100;
                this.eneSkill = Math.random() * 100;
                this.whichTurn = 1;
                this.renzokukaisu = 1;
              }
            } else if (this.eneHP2 <= 0) {
              this.mode = 110;
            } else {
              this.mode = 3;
            }
          } else {
            if (this.player && this.player.hp > 0) {
              this.whichTurn = 0;
              if (this.kaihukuNextTurnOn) {
                this.mode = 6;
                this.kaihukuNextTurnOn = false;
              } else {
                this.mode = 3;
              }
            } else if (this.battleState?.resCount !== 0) {
              this.mode = 6;
              this.resSwitch = 1;
              this.whichTurn = 0;
            } else {
              this.mode = 160;
            }
          }
        }
      }
      this.eefi++;
    } else if (this.mode >= 6 && this.mode <= 8) {
      this.mode = 5;
      if (this.resSwitch === 1) {
        if (this.player && this.gdata) {
          this.player.maxHp = Math.floor(this.player.maxHp * (this.gdata.resStatUP || 1));
          this.player.attack = Math.floor(this.player.attack * (this.gdata.resStatUP || 1));
        }
        this.battleState!.resCount--;
        this.resSwitch = 0;
      }
      if (this.player) {
        this.player.hp = this.player.maxHp;
      }
      this.eefi = 0;
    }
  }

  private myGetDameSkNumFunc(): void {
    let critRate = this.criKakuritu;
    const hpRate = this.player ? this.player.hp / this.player.maxHp : 1;

    if (hpRate <= 0.25) {
      if (hpRate <= 0.1) {
        critRate += 0.045;
      } else if (hpRate <= 0.15) {
        critRate += 0.04;
      } else if (hpRate <= 0.25) {
        critRate += 0.03;
      }
      if (critRate >= 0.7) {
        critRate = 0.7;
      }
    }

    const bossType = this.battleState?.bossType || -1;
    if (bossType === 76) {
      critRate *= 0.7;
    }

    this.crih = Math.random() <= critRate;

    if (this.myTurnEndCount < (this.gdata?.TimesDamageCrihOn || 0)) {
      this.crih = true;
    }

    if (!this.crih) {
      this.tdame = this.player?.attack || 0;
    } else {
      const critBonus = Math.random() * 6;
      const critMultiplier = 1.75 + critBonus / 5;
      this.tdame = ((this.player?.attack || 0) + 1) * critMultiplier * (this.gdata?.crihplusdamage || 1) + 4;
    }

    let defense = this.enePoint;
    if (this.hardmode === 0) {
      defense *= 1.1;
    }

    if (defense > this.tdame) {
      defense = (defense * 3 + this.tdame * 2) / 5;
    }
    defense *= 0.3;
    if (defense >= this.tdame * 0.32) {
      defense = (defense + this.tdame * 0.32 * 99) / 100;
    }
    defense = defense + Math.random() * this.enePoint * 0.02 + this.enePoint * 0.02;
    if (defense >= this.tdame * 0.44) {
      defense = (defense + this.tdame * 0.44 * 199) / 200;
    }

    this.tdame -= defense;
    this.tdame *= 0.88;
    this.tdame = this.tdame + Math.random() * this.tdame * 0.2 - this.tdame * 0.1 + Math.random() * 4 - 2;

    if (this.tdame <= 0) {
      const maxHp = this.enemy?.maxHp || 100;
      if (maxHp < 100) {
        this.tdame = Math.random() * maxHp * 0.09 + 1;
      } else {
        this.tdame = Math.random() * 10 + 1;
      }
    }

    this.tdame = Math.floor(this.tdame);

    if (this.gdata?.trueDamageKakuritu && this.gdata.trueDamageKakuritu > this.mySkillKakuritu) {
      this.tdame = (this.gdata.trueDamage || 0) + this.tdame;
    }
  }

  private eneGetDameSkNumFunc(): void {
    this.crih = false;

    const bossType = this.battleState?.bossType || -1;
    if (this.eneDouble < 27 && (bossType === 75 || bossType === 71 || bossType === 87)) {
    }

    if (!this.enemy) return;

    let damage = (this.enemy.attack * 2 + (this.enemy.attack - (this.player?.defense || 0) * 0.5) * 12) / 14;
    let threshold = this.enemy.attack * 0.5;
    if (damage < threshold) {
      damage = (threshold + damage) / 2;
    }

    threshold = this.enemy.attack * 0.3;
    if (damage < threshold) {
      damage = (threshold * 3 + damage) / 4;
    }

    threshold = this.enemy.attack * 0.2;
    if (damage < threshold) {
      damage = (threshold * 5 + damage) / 6;
    }

    threshold = this.enemy.attack * 0.1;
    if (damage < threshold) {
      damage = (threshold * 7 + damage) / 8;
    }

    damage = damage + Math.random() * damage * 0.2 - damage * 0.1 + Math.random() * 4 - 2;
    damage = damage + Math.random() * this.enemy.attack * 0.0225 + this.enemy.attack * 0.0025;

    if (damage <= 0) {
      const maxHp = this.player?.maxHp || 100;
      if (maxHp < 100) {
        damage = Math.random() * maxHp * 0.09 + 1;
      } else {
        damage = Math.random() * 10 + 1;
      }
    }

    this.tdame = Math.floor(damage);
  }

  private applyDamage(): void {
    if (!this.player || !this.enemy || !this.battleState) return;

    if (this.whichTurn === 0) {
      if (this.gdata?.DamageIncreased && this.gdata.DamageIncreased !== 0) {
        this.tdame = Math.floor(this.tdame * ((100 + this.gdata.DamageIncreased) / 100));
      }

      if (this.gdata?.renzoDamageUP && this.gdata.renzoDamageUP !== 0 && this.renzokukaisu >= 2) {
        this.tdame = Math.floor(this.tdame * this.gdata.renzoDamageUP);
      }

      this.tdame = Math.floor(this.tdame * this.eneDamageReduced);

      this.recovery();

      if (this.gdata?.myhprecovery) {
        this.myHpRecovery();
      }

      this.ClearEnemyHp();

      const mapNum = 0;
      if (Math.random() < (this.gdata?.enemissrate || 0) && mapNum >= 109 && mapNum <= 118) {
      } else {
        const secretDamage = this.SecretKey(this.enemy.hp);
        this.enemy.hp = Math.max(0, this.enemy.hp - this.tdame - secretDamage);
      }

      if (this.gdata?.doubleAttack) {
        this.myAttack();
      }
    } else if (this.whichTurn === 1) {
      if (this.player) {
        this.player.maxHp = Math.floor(this.player.maxHp * (this.gdata?.turnAddMaxHP || 1));
      }

      if (this.gdata?.DamageReduced && this.gdata.DamageReduced !== 0) {
        this.tdame = Math.floor(this.tdame * ((100 - this.gdata.DamageReduced) / 100));
      }

      if (Math.random() < (this.gdata?.missrate || 0) || this.myTurnEndCount < (this.gdata?.missrateOn || 0)) {
      } else {
        this.player.hp -= this.tdame;
      }

      if (this.player.hp < 0) {
        this.player.hp = 0;
        if (this.player.hp !== 1) {
          if ((this.gdata?.SokusiKaihiKakuritu || 0) >= 1) {
            const loc8 = Math.floor((this.gdata?.SokusiKaihiKakuritu || 0) % 10);
            const loc6 = Math.floor((this.gdata?.SokusiKaihiKakuritu || 0) / 10);
            const loc4 = [0, 0.3, 0.4, 0.5, 0.51, 0.52, 0.53];
            const loc5 = [0, 0.02, 0.03, 0.04];
            const loc1 = loc4[loc8 + loc6] + loc5[loc6];
            if (Math.random() < loc1) {
              this.player.hp = 1;
            }
          }
        }
      }
    }

    if (this.gdata?.reflection && this.gdata.reflection > 0 && this.whichTurn === 1 && this.player.hp > 0) {
      const reflectDamage = Math.floor((this.player.defense || 0) * this.gdata.reflection);
      this.enemy.hp -= reflectDamage;
      if (this.gdata.refHealOn) {
        this.player.hp += Math.floor(reflectDamage * 0.02 + 1);
        if (this.player.hp > this.player.maxHp) {
          this.player.hp = this.player.maxHp;
        }
      }
    }
  }

  public enePattern(param1: number): void {
    if (!this.player || !this.enemy || !this.battleState) return;

    if (this.whichTurn === 0) {
      if (param1 === 70 || param1 === 74) {
        this.suzakuPattern(param1);
      }
      if (param1 === 76) {
        this.kouryuuPattern(param1);
      }
    }

    if (param1 === 100 || param1 === 101 || param1 === 102) {
      this.twilight(param1);
    }

    if (this.whichTurn === 1) {
      if (param1 === 71 || param1 === 75 || param1 === 87) {
        if (this.eneDouble < 27) {
          this.eneAttack();
        }
      }

      if (param1 === 98 || param1 === 99) {
        if (this.eneSkill < 20) {
          this.AngelPattern();
        }
      }

      if (param1 === 72 || param1 === 86 || param1 === 87) {
        if (this.eneSkill < 12) {
          if (this.player.hp >= 1) {
            let damage = 150000000;
            if (this.hardmode === 1) {
              damage += 700000000;
            }
            if (param1 === 86) {
              damage += 1600000000;
            }
            this.player.hp -= damage;
          }
        }
      }
    }

    if (param1 === 73 || param1 === 87) {
      this.eneDamageReduced = this.enemy.hp / this.enemy.maxHp;
      if (this.eneDamageReduced < 0.4) {
        this.enemy.attack *= 1.004;
        this.eneDamageReduced = 0.4;
      }
    }
  }

  private suzakuPattern(param1: number): void {
    if (!this.enemy) return;

    if (this.patternCount === 0) {
      if (param1 === 70) {
        this.eneHP2 = 6000000000;
        this.eneHPM2 = 6000000000;
        this.eneATK2 = 0;
      }
      if (param1 === 74) {
        this.eneHP2 = 10000000000;
        this.eneHPM2 = 10000000000;
        this.eneATK2 = 200000000;
      }
    }

    if (this.eneHP2 > 0 && (this.enemy.hp === 0 || this.turnCount >= 1)) {
      this.turnCount++;

      if (this.turnCount === 1) {
        this.patternCount++;
        this.teneATK = (0.05 * this.patternCount + 1) * this.enemy.attack;
        this.enemy.maxHp = Math.floor((0.05 * this.patternCount + 1) * this.enemy.maxHp);
      }

      if (this.turnCount <= 3) {
        this.enemy.hp = this.eneHP2;
        this.eneHP2 -= this.tdame;
        this.enemy.attack = this.eneATK2;
      }

      if (this.turnCount > 3) {
        this.enemy.hp = this.enemy.maxHp;
        this.enemy.attack = this.teneATK;
        this.turnCount = 0;
      }
    }
  }

  private kouryuuPattern(_param1: number): void {
    if (!this.player || !this.enemy) return;

    this.eneCounter = 20;
    if (this.whichTurn === 0) {
      this.tdame = Math.floor((this.player.maxHp || 0) * 0.15);
      this.eneAttack();
      if (Math.random() * 100 <= this.eneCounter && this.patternCount >= 0) {
        this.tdame = Math.floor(this.tdame * 0.1);
        this.eneAttack();
      }
    }
  }

  private eneAttack(): void {
    if (!this.player || !this.gdata) return;

    if (this.gdata.DamageReduced !== 0) {
      this.tdame = Math.floor(this.tdame * ((100 - this.gdata.DamageReduced) / 100));
    }

    this.player.hp -= this.tdame;

    if (this.player.hp < 0) {
      this.player.hp = 0;
      if (this.player.hp !== 1) {
        if (this.gdata.SokusiKaihiKakuritu >= 1) {
          const loc8 = Math.floor(this.gdata.SokusiKaihiKakuritu % 10);
          const loc6 = Math.floor(this.gdata.SokusiKaihiKakuritu / 10);
          const loc4 = [0, 0.3, 0.4, 0.5, 0.51, 0.52, 0.53];
          const loc5 = [0, 0.02, 0.03, 0.04];
          const loc1 = loc4[loc8 + loc6] + loc5[loc6];
          if (Math.random() < loc1) {
            this.player.hp = 1;
          }
        }
      }
    }
  }

  private AngelPattern(): void {
    if (!this.player) return;

    const damage = Math.floor(this.player.hp * 0.3);
    this.player.hp = Math.max(0, this.player.hp - this.tdame - damage);
  }

  private ClearEnemyHp(): void {
    if (!this.player || !this.enemy || !this.gdata || !this.battleState) return;

    if (this.battleState.attackCount >= 52 && this.enemy.hp / this.enemy.maxHp <= 0.4 && this.gdata.hourgclassOn1) {
      this.enemy.hp = 0;
    }
  }

  private SecretKey(param1: number): number {
    if (!this.gdata) return 0;

    if (this.gdata.CurrentHpDamage || this.gdata.secretKeyOn) {
      if (Math.random() * 100 < 20) {
        const damage = Math.floor(param1 * (this.gdata.secretKeyOn ? 0.05 : 0.03));
        if (damage > 0) {
          return damage;
        }
      }
    }
    return 0;
  }

  private twilight(param1: number): void {
    if (!this.player || !this.enemy || !this.gdata || !this.battleState) return;

    this.tdame = Math.floor((this.player.maxHp || 0) * 0.1);

    if (this.whichTurn === 0 && param1 === 100) {
      if (this.enemy.hp / this.enemy.maxHp <= 0.4 && Math.random() <= 0.35) {
        this.enemy.hp += this.enemy.maxHp * 0.2;
      }
    }

    if (this.whichTurn === 1 && param1 === 101) {
      this.enemy.hp += Math.floor(this.tdame * 0.1 + 1);
      if (!this.gdata.recoveryCheck) {
        this.player.hp = 0;
      }
    }

    if (param1 === 102) {
      this.tdame = Math.floor((this.player.maxHp || 0) * 0.08);
      this.patternCheck2();

      if (this.enemy.hp / this.enemy.maxHp < 0.8 && this.phase === 1) {
        if (this.battleState.attackCount % 9 === 1) {
          this.enemy.hp += Math.floor(this.tdame * 0.1 + 1);
        }
      } else if (this.enemy.hp / this.enemy.maxHp >= 0.6 && this.enemy.hp / this.enemy.maxHp < 0.8 && this.eneSkill <= 30 && this.phase === 2) {
        this.enemy.hp += this.enemy.maxHp * 0.05;
      } else if (this.enemy.hp / this.enemy.maxHp < 0.5 && this.eneSkill <= 20 && this.phase === 3) {
        this.gdata.recovery = false;
      }
    }
  }

  private patternCheck2(): void {
    if (!this.enemy || !this.battleState) return;

    const hpRate = this.enemy.hp / this.enemy.maxHp;

    if (hpRate <= 0.8 && this.phase === 0) {
      this.phase = 1;
      this.TurnEndCount = 0;
    } else if (hpRate > 0.8 && (this.phase === 1 || this.phase === 2)) {
      this.phase = 0;
      this.TurnEndCount = 0;
      this.battleState.attackCount = 0;
    } else if (this.phase === 1 && hpRate < 0.8 && hpRate > 0.6) {
      this.phase = 2;
      this.TurnEndCount = 0;
      this.battleState.attackCount = 0;
    } else if (hpRate < 0.6 && (this.phase === 1 || this.phase === 2)) {
      this.phase = 3;
      this.TurnEndCount = 0;
    } else if (this.phase === 3 && hpRate < 0.8 && hpRate > 0.6) {
      this.phase = 2;
      this.TurnEndCount = 0;
    }
  }

  private myAttack(): void {
    if (!this.player || !this.enemy || !this.gdata) return;

    if (this.battleState!.attackCount % 5 === 1) {
      this.tdame = Math.floor((this.player.maxHp || 0) * 0.1);
      if (this.gdata.DamageIncreased !== 0) {
        this.tdame = Math.floor(this.tdame * ((100 + this.gdata.DamageIncreased) / 100));
      }
      this.enemy.hp = Math.max(0, this.enemy.hp - this.tdame);
    }
  }

  private recovery(): void {
    if (!this.player || !this.gdata) return;

    this.gdata.recoveryCheck = true;

    if (this.gdata.recovery) {
      if (this.gdata.DamegeKaihukuOn0) {
        this.player.hp += Math.floor(this.tdame * 0.02 + 1);
        this.gdata.recoveryCheck = false;
      } else if (this.gdata.DamegeKaihukuOn1) {
        this.player.hp += Math.floor(this.tdame * 0.06 + 1);
        this.gdata.recoveryCheck = false;
      } else if (this.gdata.DamegeKaihukuOn2) {
        this.player.hp += Math.floor(this.tdame * 0.09 + 1);
        this.gdata.recoveryCheck = false;
      } else if (this.gdata.DamegeKaihukuOn) {
        this.player.hp += Math.floor(this.tdame * 0.04 + 1);
        this.gdata.recoveryCheck = false;
      }

      if (this.player.hp > this.player.maxHp) {
        this.player.hp = this.player.maxHp;
      }
    }
  }

  private myHpRecovery(): void {
    if (!this.player || !this.gdata) return;

    if (!this.gdata.recoveryCheck) {
      this.player.hp += Math.floor((this.player.maxHp || 0) * 0.09 + 1);
    } else {
      this.player.hp += Math.floor((this.player.maxHp || 0) * 0.02 + 1);
    }

    if (this.player.hp > this.player.maxHp) {
      this.player.hp = this.player.maxHp;
    }
  }

  private renzokuFunc(): void {}

  private getComboRate(): number {
    let rate = this.renzoKukakuritu;
    const hpRate = this.player ? this.player.hp / this.player.maxHp : 1;

    if (hpRate <= 0.25) {
      if (hpRate <= 0.1) {
        rate += 0.11;
      } else if (hpRate <= 0.25) {
        rate += 0.08;
      }
      if (rate >= 0.8) {
        rate = 0.8;
      }
    }

    const bossType = this.battleState?.bossType || -1;
    if (bossType === 76) {
      rate *= 0.7;
    }

    return rate;
  }

  private EEFWinResultFunc(): void {
    if (!this.player || !this.enemy || !this.gdata) return;

    if (this.mode === 110) {
      this.getExp = this.enemy.expReward;

      this.getExpNokori = this.player.exp + this.enemy.expReward;
      this.eefi = 0;
      this.lvupsitanum = 0;
      this.mode = 112;
    } else if (this.mode === 112) {
      this.eefi++;
      if (this.eefi >= 24) {
        this.mode = 113;
        this.eefi = 0;
      }
    } else if (this.mode === 113 || this.mode === 120) {
      this.eefi++;

      if (this.getExp !== 0) {
        while (true) {
          const nextExp = this.player.expToNextLevel;
          if (this.getExpNokori < nextExp) {
            this.player.exp = this.getExpNokori;
            this.getExpNokori -= this.getExp;
            this.getExp = 0;
            break;
          }

          this.getExpNokori -= nextExp;
          this.getExp -= nextExp;
          this.lvupsitanum++;

          this.player.level++;
          this.player.expToNextLevel = this.getExpForLevel(this.player.level);
        }
      }

      if (this.getExp === 0 && this.mode !== 120) {
        this.mode = 120;
      }
    }
  }

  private EEFLoseResultFunc(): void {
    if (this.mode === 160) {
      this.eefi = 0;
      this.mode = 161;
    } else if (this.mode === 161) {
      this.eefi++;
      if (this.eefi >= 60) {
        this.mode = 170;
      }
    }
  }

  private getExpForLevel(level: number): number {
    if (level < 125000) {
      return 0;
    }
    return Math.floor(level * (level * 0.0022385 + 6.35));
  }

  public Get100LevelAfterExp(param1: number): number {
    return Math.floor(0.0022385 * (100 * param1 * param1 + 10100 * param1 + 338350) + 6.35 * (100 * param1 + 5050));
  }

  public GetItemTextColor(_param1: number): number {
    return Math.floor(Math.random() * 10000000);
  }

  public nextPhase(): void {
    this.eefi = 0;
    this.mode = 777;
  }

  public clear(): void {}

  public BattleEnd(_param1: number): void {}

  public BattleEnd2(): void {}

  public restart_Lange(): void {}

  public enePhase(): void {
    this.mode = 1000;
  }

  public getState(): {
    player: Player | null;
    enemy: Enemy | null;
    battleState: BattleState | null;
    mode: number;
    whichTurn: number;
    comboCount: number;
  } {
    return {
      player: this.player,
      enemy: this.enemy,
      battleState: this.battleState,
      mode: this.mode,
      whichTurn: this.whichTurn,
      comboCount: this.renzokukaisu,
    };
  }
}
