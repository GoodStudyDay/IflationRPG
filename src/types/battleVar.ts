export interface BattleVarState {
  myhp: number;
  myhpm: number;
  myatk: number;
  mydef: number;
  myspeed: number;
  myluk: number;
  renzoKukakuritu: number;
  criKakuritu: number;
  itemKakuritu: number;
  gUpBairitu: number;
  enePoint: number;
  BounasSyu: number;
  map: number;
  lv: number;
}

export interface BattleVarSettings {
  hardmode: number;
  renzokuPlusKakuritu: number;
  crihPlusKakuritu: number;
  speedwariai: number;
  lukwariai: number;
  hourGlassON: boolean;
  hourGlassON1: boolean;
  expbairitu: number;
}

export interface BattleVarResult {
  comboRate: number;
  critRate: number;
  itemDropRate: number;
  goldMultiplier: number;
  expMultiplier: number;
  playerStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
  };
}
