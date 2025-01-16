import { expect, assert, test } from 'vitest'
import { DieSet, DieType, Roll, RollMaximumDieSetValue, RollMinimumDieSetValue } from '../../utils/DieUtilities';

const randomRetries:number = 1000;

interface IRollTestData {
    set: DieSet[];
    min: number;
    max: number;
}

test("Should be able to roll normal die sets", () => {
    let testData: IRollTestData[] = [
        {
            set: [{
                diceCount: 1,
                dieType: DieType.d6
            }],
            min: 1,
            max: 6
        },
        {
            set: [{
                diceCount: 2,
                dieType: DieType.d6
            }],
            min: 2,
            max: 12
        },
        {
            set: [{
                diceCount: 2,
                dieType: DieType.d10
            }],
            min: 2,
            max: 20
        },
        {
            set: [
                {
                    diceCount: 1,
                    dieType: DieType.d100
                },
                {
                    diceCount: 1,
                    dieType: DieType.d20
                },
                {
                    diceCount: 1,
                    dieType: DieType.d12
                }
            ],
            min: 3,
            max: 132
        },
        {
            set: [{
                diceCount: 1,
                dieType: DieType.None
            }],
            min: 1,
            max: 1
        }
    ];

    TestRolls(testData);
});

test("Should be able to roll normal custom sets", () =>{
    let testData: IRollTestData[] = [
        {
            set: [{
                diceCount: 1,
                dieType: DieType.Custom,
                dieCustomValue: 7
            }],
            min: 1,
            max: 7
        },
        {
            set: [{
                diceCount: 1,
                dieType: DieType.Custom,
                dieCustomValue: 6
            }],
            min: 1,
            max: 6
        },
        {
            set: [
                {
                    diceCount: 1,
                    dieType: DieType.Custom,
                    dieCustomValue: 7
                },
                {
                    diceCount: 3,
                    dieType: DieType.Custom,
                    dieCustomValue: 11
                },
                {
                    diceCount: 3,
                    dieType: DieType.Custom,
                    dieCustomValue: 22
                }
            ],
            min: 7,
            max: 106
        }
    ];

    TestRolls(testData);
});


function TestRolls(testData: IRollTestData[]){
    for (var index in testData) {
        let minResult = RollMinimumDieSetValue(testData[index].set);
        assert.equal(minResult.total, testData[index].min, `Roll test ${index} minimum roll should be equal to ${testData[index].min}, but is equal to ${minResult.total}`);
        let maxResult = RollMaximumDieSetValue(testData[index].set);
        assert.equal(maxResult.total, testData[index].max, `Roll test ${index} maximum roll should be equal to ${testData[index].max}, but is equal to ${maxResult.total}`);

        for(var i = 0; i < randomRetries; i++){
            let result = Roll(testData[index].set);
            assert.isAtLeast(result.total, testData[index].min, `Roll test ${index} roll should be at least ${testData[index].min}`);
            assert.isAtMost(result.total, testData[index].max, `Roll test ${index} roll should not exceed ${testData[index].max}`)
        }
    }
}