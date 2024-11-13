import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.attackPower = 15;
  }

  attack() {
    return Math.floor(Math.random() * this.attackPower) + 1;
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp < 0) this.hp = 0;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 50 + stage * 10;
    this.attackPower = 5 + stage * 2;
  }

  attack() {
    return Math.floor(Math.random() * this.attackPower) + 1;
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp < 0) this.hp = 0;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 HP: ${player.hp} `,
    ) +
    chalk.redBright(
      `| 몬스터 HP: ${monster.hp} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));
    if (logs.length > 5) logs = logs.slice(-5);  // 최근 5개의 로그만 유지

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 방어한다 3. 도망간다`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    let playerDamage = 0;
    let monsterDamage = 0;

    switch(choice) {
      case '1':
        playerDamage = player.attack();
        monster.takeDamage(playerDamage);
        logs.push(chalk.green(`플레이어가 몬스터에게 ${playerDamage}의 데미지를 입혔습니다.`));
        break;
      case '2':
        monsterDamage = Math.floor(monster.attack() / 2);  // 방어 시 데미지 반감
        player.takeDamage(monsterDamage);
        logs.push(chalk.yellow(`플레이어가 방어하여 ${monsterDamage}의 데미지를 입었습니다.`));
        break;
      case '3':
        if (Math.random() < 0.5) {
          logs.push(chalk.blue(`도망치는데 성공했습니다!`));
          return 'escape';
        } else {
          logs.push(chalk.red(`도망치는데 실패했습니다.`));
        }
        break;
      default:
        logs.push(chalk.red(`잘못된 선택입니다. 턴을 넘깁니다.`));
    }

    if (choice !== '2' && monster.hp > 0) {  // 플레이어가 방어하지 않았을 때만 몬스터가 공격
      monsterDamage = monster.attack();
      player.takeDamage(monsterDamage);
      logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다.`));
    }

    if (player.hp <= 0) {
      console.clear();
      displayStatus(stage, player, monster);
      console.log(chalk.red(`게임 오버! 플레이어가 쓰러졌습니다.`));
      return 'lose';
    }

    if (monster.hp <= 0) {
      console.clear();
      displayStatus(stage, player, monster);
      console.log(chalk.green(`승리! 몬스터를 물리쳤습니다.`));
      return 'win';
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    if (result === 'lose') {
      console.log(chalk.red(`게임 종료! 최종 스테이지: ${stage}`));
      break;
    } else if (result === 'escape') {
      console.log(chalk.yellow(`도망쳤습니다. 다음 스테이지로 이동합니다.`));
      stage++;
    } else if (result === 'win') {
      console.log(chalk.green(`스테이지 ${stage} 클리어!`));
      stage++;
      player.hp = Math.min(player.hp + 20, 100);  // 승리 시 체력 회복
      console.log(chalk.blue(`체력이 회복되었습니다. 현재 체력: ${player.hp}`));
    }

    if (stage > 10) {
      console.log(chalk.green(`축하합니다! 모든 스테이지를 클리어했습니다!`));
    } else {
      console.log(chalk.yellow(`다음 스테이지로 이동합니다. 엔터를 눌러주세요.`));
      readlineSync.question();
    }
  }
}
