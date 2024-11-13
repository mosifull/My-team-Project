const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

class DigimonGame {
  constructor() {
    this.playerDigimon = null;
    this.evolutionStage = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.attack = 50;
    this.exp = 0;
    this.level = 1;
    this.expToNextLevel = 100;
    this.inventory = ['회복 포션', '회복 포션', '회복 포션'];
    this.skills = [];
    this.money = 100;
    this.evolutionRoutes = {
      '아구몬': ['아구몬', '그레이몬', '메탈그레이몬', '워그레이몬'],
      '파피몬': ['파피몬', '가루몬', '워가루몬', '메탈가루몬'],
      '길몬': ['길몬', '그라우몬', '메가로그라우몬', '듀크몬']
    };
    this.evolutionStats = {
      '아구몬': { hp: 100, attack: 50, skill: '베이비 플레임' },
      '그레이몬': { hp: 200, attack: 100, skill: '메가 플레임' },
      '메탈그레이몬': { hp: 350, attack: 180, skill: '기가 디스트로이어' },
      '워그레이몬': { hp: 500, attack: 250, skill: '테라 포스' },
      '파피몬': { hp: 90, attack: 60, skill: '파피 핸드' },
      '가루몬': { hp: 180, attack: 120, skill: '하울링 블래스터' },
      '워가루몬': { hp: 320, attack: 200, skill: '울프 클로' },
      '메탈가루몬': { hp: 450, attack: 270, skill: '코키토 블래스터' },
      '길몬': { hp: 110, attack: 45, skill: '파이로 스피어' },
      '그라우몬': { hp: 220, attack: 90, skill: '메가 버스터' },
      '메가로그라우몬': { hp: 380, attack: 160, skill: '더블 임팩트' },
      '듀크몬': { hp: 480, attack: 240, skill: '로열 세이버' }
    };
    this.shopItems = [
      { name: '회복 포션', price: 50, description: 'HP를 50 회복합니다.' },
      { name: '고급 회복 포션', price: 100, description: 'HP를 100 회복합니다.' },
      { name: '공격력 강화석', price: 200, description: '공격력을 10 증가시킵니다.' },
      { name: 'HP 강화석', price: 200, description: '최대 HP를 30 증가시킵니다.' }
    ];
  }

  async start() {
    console.log('디지몬 어드벤처에 오신 것을 환영합니다!');
    console.log('당신의 파트너 디지몬을 선택하세요:');
    console.log('1. 아구몬');
    console.log('2. 파피몬');
    console.log('3. 길몬');

    const choice = await question('선택 (1-3): ');
    switch (choice) {
      case '1':
        this.playerDigimon = '아구몬';
        break;
      case '2':
        this.playerDigimon = '파피몬';
        break;
      case '3':
        this.playerDigimon = '길몬';
        break;
      default:
        console.log('잘못된 선택입니다. 아구몬을 기본으로 선택합니다.');
        this.playerDigimon = '아구몬';
    }

    const initialStats = this.evolutionStats[this.playerDigimon];
    this.hp = initialStats.hp;
    this.maxHp = initialStats.hp;
    this.attack = initialStats.attack;
    this.skills.push(initialStats.skill);

    console.log(`${this.playerDigimon}를 선택하셨습니다!`);
    await this.gameLoop();
  }

  async gameLoop() {
    while (true) {
      console.log('\n=== 메인 메뉴 ===');
      console.log('1. 전투');
      console.log('2. 상태 확인');
      console.log('3. 인벤토리');
      console.log('4. 상점');
      console.log('5. 종료');

      const choice = await question('선택해주세요 (1-5): ');

      switch (choice) {
        case '1':
          await this.battle();
          break;
        case '2':
          this.showStatus();
          break;
        case '3':
          await this.useItem();
          break;
        case '4':
          await this.shop();
          break;
        case '5':
          console.log('게임을 종료합니다. 안녕히 가세요!');
          rl.close();
          return;
        default:
          console.log('잘못된 선택입니다. 다시 선택해주세요.');
      }
    }
  }

  async battle() {
    const enemy = this.generateEnemy();
    console.log(`\n야생의 ${enemy.name}이(가) 나타났다!`);

    while (enemy.hp > 0 && this.hp > 0) {
      console.log(`\n${enemy.name} HP: ${enemy.hp}/${enemy.maxHp}`);
      console.log(`${this.playerDigimon} HP: ${this.hp}/${this.maxHp}`);
      console.log('\n=== 전투 메뉴 ===');
      console.log('1. 일반 공격');
      console.log('2. 스킬 사용');
      console.log('3. 아이템 사용');
      console.log('4. 도망가기');

      const choice = await question('선택해주세요 (1-4): ');

      switch (choice) {
        case '1':
          this.attack(enemy);
          break;
        case '2':
          await this.useSkill(enemy);
          break;
        case '3':
          await this.useItem();
          break;
        case '4':
          if (Math.random() < 0.5) {
            console.log('도망치는데 성공했습니다!');
            return;
          } else {
            console.log('도망치지 못했습니다!');
          }
          break;
        default:
          console.log('잘못된 선택입니다.');
          continue;
      }

      if (enemy.hp > 0) {
        enemy.attack(this);
      }
    }

    if (this.hp <= 0) {
      console.log('전투에서 패배했습니다...');
      this.hp = Math.floor(this.maxHp * 0.5);
      console.log(`${this.playerDigimon}의 HP가 ${this.hp}로 회복되었습니다.`);
    } else {
      console.log(`${enemy.name}을(를) 물리쳤습니다!`);
      this.gainExp(enemy.exp);
      this.gainMoney(enemy.money);
    }
    attack(target) {
      const damage = Math.floor(this.attack * (0.8 + Math.random() * 0.4));
      target.hp = Math.max(0, target.hp - damage);
      console.log(`${this.playerDigimon}의 공격! ${target.name}에게 ${damage}의 데미지를 입혔습니다.`);
    }
  
    async useSkill(target) {
      if (this.skills.length === 0) {
        console.log('사용할 수 있는 스킬이 없습니다.');
        return;
      }
  
      console.log('\n=== 사용 가능한 스킬 ===');
      this.skills.forEach((skill, index) => {
        console.log(`${index + 1}. ${skill}`);
      });
  
      const choice = await question(`사용할 스킬을 선택하세요 (1-${this.skills.length}): `);
      const skillIndex = parseInt(choice) - 1;
  
      if (skillIndex >= 0 && skillIndex < this.skills.length) {
        const damage = Math.floor(this.attack * 1.5 * (0.8 + Math.random() * 0.4));
        target.hp = Math.max(0, target.hp - damage);
        console.log(`${this.playerDigimon}의 ${this.skills[skillIndex]}! ${target.name}에게 ${damage}의 데미지를 입혔습니다.`);
      } else {
        console.log('잘못된 선택입니다.');
      }
    }
  
    async useItem() {
      if (this.inventory.length === 0) {
        console.log('인벤토리가 비어있습니다.');
        return;
      }
  
      console.log('\n=== 인벤토리 ===');
      const itemCounts = {};
      this.inventory.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
  
      Object.entries(itemCounts).forEach(([item, count], index) => {
        console.log(`${index + 1}. ${item} (${count}개)`);
      });
  
      const choice = await question('사용할 아이템을 선택하세요 (0: 취소): ');
      const itemIndex = parseInt(choice) - 1;
  
      if (choice === '0') {
        return;
      }
  
      const selectedItem = Object.keys(itemCounts)[itemIndex];
      if (selectedItem) {
        this.inventory = this.inventory.filter((item, index) => index !== this.inventory.indexOf(selectedItem));
        
        switch (selectedItem) {
          case '회복 포션':
            const healAmount = 50;
            this.hp = Math.min(this.maxHp, this.hp + healAmount);
            console.log(`HP가 ${healAmount} 회복되었습니다.`);
            break;
          case '고급 회복 포션':
            const highHealAmount = 100;
            this.hp = Math.min(this.maxHp, this.hp + highHealAmount);
            console.log(`HP가 ${highHealAmount} 회복되었습니다.`);
            break;
          case '공격력 강화석':
            this.attack += 10;
            console.log('공격력이 10 증가했습니다.');
            break;
          case 'HP 강화석':
            this.maxHp += 30;
            this.hp += 30;
            console.log('최대 HP가 30 증가했습니다.');
            break;
        }
      } else {
        console.log('잘못된 선택입니다.');
      }
    }
  
    async shop() {
      while (true) {
        console.log('\n=== 상점 ===');
        console.log(`보유 골드: ${this.money}`);
        console.log('0. 나가기');
        this.shopItems.forEach((item, index) => {
          console.log(`${index + 1}. ${item.name} - ${item.price}G (${item.description})`);
        });
  
        const choice = await question('구매할 아이템을 선택하세요: ');
        if (choice === '0') break;
  
        const itemIndex = parseInt(choice) - 1;
        if (itemIndex >= 0 && itemIndex < this.shopItems.length) {
          const item = this.shopItems[itemIndex];
          if (this.money >= item.price) {
            this.money -= item.price;
            this.inventory.push(item.name);
            console.log(`${item.name}을(를) 구매했습니다.`);
          } else {
            console.log('골드가 부족합니다.');
          }
        } else {
          console.log('잘못된 선택입니다.');
        }
      }
    }
  
    evolve() {
      if (this.evolutionStage >= 3) {
        console.log('이미 최종 진화 단계입니다.');
        return;
      }
  
      const currentRoute = this.evolutionRoutes[this.playerDigimon.split(' ')[0]];
      if (!currentRoute) {
        console.log('진화 경로를 찾을 수 없습니다.');
        return;
      }
  
      this.evolutionStage++;
      const newForm = currentRoute[this.evolutionStage];
      const newStats = this.evolutionStats[newForm];
  
      if (!newStats) {
        console.log('진화 정보를 찾을 수 없습니다.');
        return;
      }
  
      console.log(`\n=== 진화! ===`);
      console.log(`${this.playerDigimon}가 ${newForm}으로 진화했습니다!`);
      
      this.playerDigimon = newForm;
      this.maxHp = newStats.hp;
      this.hp = this.maxHp;
      this.attack = newStats.attack;
      
      if (newStats.skill && !this.skills.includes(newStats.skill)) {
        this.skills.push(newStats.skill);
        console.log(`새로운 스킬 [${newStats.skill}]을(를) 습득했습니다!`);
      }
  
      console.log('\n=== 새로운 스탯 ===');
      console.log(`최대 HP: ${this.maxHp}`);
      console.log(`공격력: ${this.attack}`);
      console.log(`보유 스킬: ${this.skills.join(', ')}`);
    }
  
    showStatus() {
      console.log('\n=== 상태 창 ===');
      console.log(`디지몬: ${this.playerDigimon}`);
      console.log(`레벨: ${this.level}`);
      console.log(`HP: ${this.hp}/${this.maxHp}`);
      console.log(`공격력: ${this.attack}`);
      console.log(`경험치: ${this.exp}/${this.expToNextLevel}`);
      console.log(`보유 골드: ${this.money}`);
      console.log(`보유 스킬: ${this.skills.join(', ')}`);
      console.log(`진화 단계: ${this.evolutionStage}`);
    }
  
    gainExp(amount) {
      this.exp += amount;
      console.log(`${amount} 경험치를 획득했습니다!`);
      
      while (this.exp >= this.expToNextLevel) {
        this.levelUp();
      }
    }
  
    levelUp() {
      this.level++;
      this.exp -= this.expToNextLevel;
      this.expToNextLevel = Math.floor(this.expToNextLevel * 1.2);
      this.maxHp += 20;
      this.hp = this.maxHp;
      this.attack += 10;
      
      console.log(`\n=== 레벨 업! ===`);
      console.log(`${this.playerDigimon}가 레벨 ${this.level}이 되었습니다!`);
      console.log('모든 스탯이 상승했습니다!');
  
      // 5레벨 단위로 자동 진화
      if (this.level % 5 === 0 && this.evolutionStage < 3) {
        this.evolve();
      }
    }
  
    gainMoney(amount) {
      this.money += amount;
      console.log(`${amount} 골드를 획득했습니다!`);
    }
  
    generateEnemy() {
      const enemies = [
        { name: '누메몬', hp: 50, maxHp: 50, attack: 20, exp: 30, money: 20 },
        { name: '고블리몬', hp: 70, maxHp: 70, attack: 25, exp: 40, money: 30 },
        { name: '베지몬', hp: 90, maxHp: 90, attack: 30, exp: 50, money: 40 },
        { name: '레드베지몬', hp: 120, maxHp: 120, attack: 40, exp: 70, money: 60 },
        { name: '쉐도우몬', hp: 150, maxHp: 150, attack: 50, exp: 100, money: 80 }
      ];
  
      const enemy = enemies[Math.floor(Math.random() * enemies.length)];
      enemy.attack = function(target) {
        const damage = Math.floor(this.attack * (0.8 + Math.random() * 0.4));
        target.hp = Math.max(0, target.hp - damage);
        console.log(`${this.name}의 공격! ${target.playerDigimon}에게 ${damage}의 데미지를 입혔습니다.`);
      };
  
      return enemy;
    }
  }
  
  // 게임 시작
  async function main() {
    const game = new DigimonGame();
    await game.start();
  }
  
  main().catch(console.error);
  }
  