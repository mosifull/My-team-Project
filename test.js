class Digimon {
    constructor(name, level) {
        this.name = name;
        this.level = level;
        this.exp = 0;
        this.nextExp = 5; // 처음 레벨업에 필요한 경험치
        this.stats = {
            attack: 10,
            defense: 10,
            health: 50,
            maxHealth: 50, // 최대 체력 추가
            accuracy: 10,
            evasion: 5, // 회피 확률 (%)
            block: 5,   // 블록 확률 (%)
            criticalChance: 10 // 크리티컬 확률 (%), 기본값 10%
        };
        this.evolutionPath = {
            "깜몬": ["아구몬", "파피몬", "길몬", "레나몬"],
            "아구몬": ["그레이몬", "메탈그레이몬", "워그레이몬"],
            "파피몬": ["가루몬", "워가루몬", "메탈가루몬"],
            "길몬": ["그라우몬", "메탈그라우몬", "듀크몬"],
            "레나몬": ["구미호몬", "도사몬", "샤크라몬"]
        };
        this.evolutionLevels = [5, 15, 25, 41]; // 진화가 발생하는 레벨
        this.evolutionStage = this.getEvolutionStage(); // 현재 진화 단계
        this.bossDefeatedCount = 0; // 보스 몬스터 처치 카운트
        this.items = []; // 아이템 목록
    }

    // 현재 진화 단계를 반환하는 메서드
    getEvolutionStage() {
        if (this.level < 5) return "유년기";
        else if (this.level < 15) return "성장기";
        else if (this.level < 25) return "성숙기";
        else if (this.level < 41) return "완전체";
        else if (this.level < 70) return "궁극체"; // 최대 레벨 70
        else return "최대 레벨"; // 최대 레벨에 도달했을 때
    }

    // 경험치를 추가하고 레벨업 검사
    addExp(amount) {
        this.exp += amount;
        console.log(`${this.name}가 ${amount} 경험치를 얻었습니다. 현재 경험치: ${this.exp}/${this.nextExp}`);
        
        if (this.exp >= this.nextExp) {
            this.levelUp();
        }
    }

    // 레벨업 메서드
    levelUp() {
        if (this.level < 70) { // 최대 레벨 제한
            this.level++;
            this.exp = 0;
            console.log(`${this.name}가 레벨업 했습니다! 현재 레벨: ${this.level}`);
            
            this.increaseStats();
            this.nextExp *= 2; // 레벨업에 필요한 경험치를 두 배로 증가
            console.log(`다음 레벨업에 필요한 경험치: ${this.nextExp}`);

            this.checkEvolution();
        } else {
            console.log(`${this.name}는 이미 최대 레벨에 도달했습니다!`);
        }
    }

    // 스탯 증가 메서드
    increaseStats() {
        for (let stat in this.stats) {
            const increase = Math.floor(Math.random() * 5) + 1; // 1 ~ 5 사이의 랜덤 값
            this.stats[stat] += increase;
            console.log(`${stat}가 ${increase}만큼 증가했습니다! 현재 ${stat}: ${this.stats[stat]}`);
        }
    }

    // 진화 확인 메서드
    checkEvolution() {
        const evolutionStage = this.evolutionLevels.indexOf(this.level);
        if (evolutionStage !== -1) {
            this.evolve(evolutionStage);
        }
    }

    // 진화 메서드
    evolve(stage) {
        const currentPath = this.evolutionPath[this.name];
        if (currentPath && stage < currentPath.length) {
            this.name = currentPath[stage];
            this.evolutionStage = this.getEvolutionStage(); // 진화 후 단계 업데이트
            this.applyEvolutionStats(stage); // 진화 시 스탯 증가 적용
            console.log(`축하합니다! 디지몬이 ${this.name}(으)로 진화했습니다!`);
        }
    }

    // 진화 시 스탯 증가 메서드
    applyEvolutionStats(stage) {
        switch (stage) {
            case 1: // 성장기
                this.stats.attack = Math.floor(this.stats.attack * 1.2);
                this.stats.defense = Math.floor(this.stats.defense * 1.2);
                this.stats.health = Math.floor(this.stats.health * 1.2);
                break;
            case 2: // 완전체
                this.stats.attack = Math.floor(this.stats.attack * 1.5);
                this.stats.defense = Math.floor(this.stats.defense * 1.5);
                this.stats.health = Math.floor(this.stats.health * 1.5);
                break;
            case 3: // 궁극체
                this.stats.attack = Math.floor(this.stats.attack * 2);
                this.stats.defense = Math.floor(this.stats.defense * 2);
                this.stats.health = Math.floor(this.stats.health * 2);
                break;
        }
        console.log(`진화 후 스탯이 증가했습니다! 현재 스탯: 공격력 ${this.stats.attack}, 방어력 ${this.stats.defense}, 체력 ${this.stats.health}`);
    }

    // 아이템 사용 메서드
    useItem(item) {
        if (this.items.includes(item)) {
            console.log(`${this.name}가 ${item}을(를) 사용했습니다!`);
            // 아이템 효과 적용
            if (item === "체력 회복제") {
                const healAmount = Math.floor(this.stats.maxHealth * 0.3); // 전체 체력의 30% 회복
                this.stats.health = Math.min(this.stats.health + healAmount, this.stats.maxHealth); // 최대 체력 초과 방지
                console.log(`체력이 ${healAmount} 회복되었습니다! 현재 체력: ${this.stats.health}`);
            } else if (item === "공격력 증가 아이템") {
                this.currentAttackBoost = this.stats.attack * 0.3; // 현재 공격력의 30% 증가
                this.stats.attack += this.currentAttackBoost;
                console.log(`공격력이 ${this.currentAttackBoost}만큼 증가했습니다! 현재 공격력: ${this.stats.attack}`);
            }
            // 아이템 사용 후 목록에서 제거
            this.items.splice(this.items.indexOf(item), 1);
        } else {
            console.log(`${item}이(가) 없습니다!`);
        }
    }

    // 아이템 추가 메서드
    addItem(item) {
        this.items.push(item);
        console.log(`${this.name}가 ${item}을(를) 획득했습니다!`);
    }

    // 던전 탐험 메서드
    exploreDungeon() {
        const action = prompt("던전에서 무엇을 하시겠습니까? 1. 나아간다 2. 휴식한다 3. 돌아간다");

        if (action === "1") {
            const randomChance = Math.random() * 100;
            if (randomChance < 70) {
                console.log(`${this.name}가 전투에 들어갑니다!`);
                battle(this); // 전투 함수 호출
            } else if (randomChance < 95) {
                console.log(`${this.name}가 아무 일도 일어나지 않았습니다.`);
            } else {
                const itemType = Math.random() < 0.5 ? "공격력 증가 아이템" : "체력 회복제";
                this.addItem(itemType); // 아이템 추가
                console.log(`${this.name}가 ${itemType}을(를) 획득했습니다!`);
            }
        } else if (action === "2") {
            // 휴식 시 최대 체력의 10% 회복
            const healAmount = Math.floor(this.stats.maxHealth * 0.1);
            this.stats.health = Math.min(this.stats.health + healAmount, this.stats.maxHealth);
            console.log(`${this.name}가 휴식을 취하고 체력이 ${healAmount} 회복되었습니다! 현재 체력: ${this.stats.health}`);

            // 30% 확률로 전투 시작
            if (Math.random() < 0.3) {
                console.log(`${this.name}가 휴식 중 적과 마주쳤습니다! 전투가 시작됩니다!`);
                battle(this); // 전투 함수 호출
            } else {
                console.log(`${this.name}가 안전하게 휴식을 취했습니다.`);
            }
        } else if (action === "3") {
            console.log(`${this.name}가 던전을 돌아갑니다.`);
        } else {
            console.log("잘못된 선택입니다. 다시 선택하세요.");
            this.exploreDungeon(); // 잘못된 선택 시 다시 호출
        }
    }
}

// 적 디지몬 클래스
class Enemy {
    constructor(playerDigimon) {
        this.type = this.generateType(); // 디지몬 종류 결정
        this.level = this.generateLevel(playerDigimon.level);
        this.name = `${this.type} 디지몬(레벨 ${this.level})`;
        this.stats = this.calculateStats(playerDigimon);
    }

    // 적 디지몬 종류 생성 메서드
    generateType() {
        const rand = Math.random();
        if (rand < 0.7) return "일반"; // 70% 확률
        else if (rand < 1.0) return "정예"; // 30% 확률
        return "보스"; // 보스는 별도로 생성
    }

    // 적 디지몬 레벨 생성 메서드
    generateLevel(playerLevel) {
        return Math.max(1, playerLevel - 5 + Math.floor(Math.random() * 16)); // -5에서 +10 사이의 레벨
    }

    // 적 디지몬 스탯 계산 메서드
    calculateStats(playerDigimon) {
        let stats = {};
        if (this.type === "일반") {
            stats.attack = Math.floor(playerDigimon.stats.attack * 0.7); // 30% 하락
            stats.defense = Math.floor(playerDigimon.stats.defense * 0.7);
            stats.health = Math.floor(playerDigimon.stats.health * 0.7);
        } else if (this.type === "정예") {
            stats.attack = Math.floor(playerDigimon.stats.attack * 0.9); // 10% 하락
            stats.defense = Math.floor(playerDigimon.stats.defense * 0.9);
            stats.health = Math.floor(playerDigimon.stats.health * 0.9);
        } else {
            // 보스 몬스터는 동일한 스탯
            stats.attack = playerDigimon.stats.attack;
            stats.defense = playerDigimon.stats.defense;
            stats.health = playerDigimon.stats.health;
        }
        stats.criticalChance = Math.min(playerDigimon.stats.criticalChance, 70); // 최대 크리티컬 확률 70%
        stats.evasion = Math.min(30, playerDigimon.stats.evasion); // 최대 회피 확률 30%
        stats.block = Math.min(50, playerDigimon.stats.block); // 최대 블록 확률 50%
        return stats;
    }
}

// 크리티컬 공격 확인 함수
function isCriticalHit(criticalChance) {
    return Math.random() * 100 < criticalChance; // 크리티컬 확률을 퍼센트로 체크
}

// 공격이 회피되었는지 확인하는 함수
function isEvaded(attacker, defender) {
    const hitChance = attacker.stats.accuracy - defender.stats.evasion;
    return Math.random() * 100 >= hitChance; // 회피 성공 여부
}

// 대미지 계산 함수
function calculateDamage(attacker, defender) {
    let damage = attacker.stats.attack - defender.stats.defense;
    
    if (damage < 0) damage = 0; // 대미지가 0 미만일 경우 0으로 설정

    if (isCriticalHit(attacker.stats.criticalChance)) {
        damage *= 2; // 크리티컬 공격 시 대미지 2배
        console.log(`${attacker.name}의 크리티컬 공격!`);
    }

    // 블록 여부 확인
    if (Math.random() * 100 < defender.stats.block) {
        damage *= 0.5; // 블록 시 대미지 50% 감소
        console.log(`${defender.name}가 블록했습니다!`);
    }

    return damage;
}

// 경험치 계산 함수
function calculateExperience(enemyLevel, evolutionStage, enemyType) {
    let baseExp = Math.floor(enemyLevel * 5); // 기본 경험치
    let multiplier = 1; // 기본 배율

    switch (enemyType) {
        case "일반":
            multiplier = 1; // 일반 몬스터는 기본 경험치
            break;
        case "정예":
            multiplier = 1.3; // 정예 몬스터는 30% 추가
            break;
        case "보스":
            multiplier = 1.5; // 보스 몬스터는 50% 추가
            break;
    }

    return Math.floor(baseExp * multiplier); // 경험치 계산
}

// 전투 함수
function battle(playerDigimon) {
    let enemy;
    while (true) {
        if (playerDigimon.bossDefeatedCount < 20) {
            enemy = new Enemy(playerDigimon);
        } else {
            // 보스 몬스터 생성
            enemy = new Enemy(playerDigimon);
            enemy.type = "보스";
            enemy.stats = playerDigimon.stats; // 스탯 동일
            enemy.name = `보스 디지몬(레벨 ${enemy.level})`;
        }

        console.log(`${playerDigimon.name}와 ${enemy.name}가 전투를 시작합니다!`);

        while (playerDigimon.stats.health > 0 && enemy.stats.health > 0) {
            // 플레이어 행동 선택
            const action = prompt("행동을 선택하세요: 1. 공격 2. 도망 3. 아이템 사용");

            if (action === "1") { // 공격
                if (isEvaded(playerDigimon, enemy)) {
                    console.log(`${enemy.name}의 회피로 공격이 빗나갔습니다!`);
                } else {
                    const damage = calculateDamage(playerDigimon, enemy);
                    enemy.stats.health -= damage;
                    console.log(`${playerDigimon.name}가 ${enemy.name}에게 ${damage}의 대미지를 입혔습니다. ${enemy.name}의 남은 체력: ${enemy.stats.health}`);
                }
            } else if (action === "2") { // 도망
                const escapeChance = Math.random();
                if (escapeChance < 0.5) {
                    console.log(`${playerDigimon.name}가 도망쳤습니다!`);
                    return; // 전투 종료
                } else {
                    console.log(`${playerDigimon.name}가 도망에 실패했습니다!`);
                }
            } else if (action === "3") { // 아이템 사용
                const item = prompt("사용할 아이템을 입력하세요 (예: 체력 회복제, 공격력 증가 아이템)");
                playerDigimon.useItem(item);
            } else {
                console.log("잘못된 선택입니다. 다시 선택하세요.");
                continue;
            }

            if (enemy.stats.health <= 0) {
                console.log(`${enemy.name}를 처치했습니다!`);
                const expGain = calculateExperience(enemy.level, playerDigimon.evolutionStage, enemy.type);
                playerDigimon.addExp(expGain); // 경험치 추가

                // 아이템 획득
                const itemType = Math.random() < 0.5 ? "공격력 증가 아이템" : "체력 회복제";
                playerDigimon.addItem(itemType); // 아이템 추가
                console.log(`${playerDigimon.name}가 ${itemType}을(를) 획득했습니다!`);

                if (enemy.type === "보스") {
                    playerDigimon.bossDefeatedCount = 0; // 보스 처치 후 카운트 초기화
                }
            }
        }
    }
}

// 게임 시작
const playerDigimon = new Digimon("깜몬", 1);
playerDigimon.exploreDungeon(); // 던전 탐험 시작
