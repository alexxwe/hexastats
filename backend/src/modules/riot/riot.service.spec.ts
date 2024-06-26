import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { RiotService } from './riot.service'
import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { RiotSummonerType } from 'src/common/schemas'

describe('RiotService', () => {
    let service: RiotService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, ConfigModule],
            providers: [RiotService],
        }).compile()

        service = module.get<RiotService>(RiotService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getBasicInfo', () => {
        it('should return summoner info when provided valid server and RiotIdDto', async () => {
            const server = 'test_server'
            const riotId = { name: 'test_name', tag: 'test_tag' }
            const expectedSummonerResponse: RiotSummonerType = {
                id: 'test_id',
                accountId: 'test_accountId',
                puuid: 'test_puuid',
                profileIconId: 123,
                revisionDate: Date.now(),
                summonerLevel: 30,
                name: 'Test Summoner',
            }

            jest.spyOn(service, 'getBasicInfo').mockResolvedValueOnce({
                ...expectedSummonerResponse,
                riotIdName: 'Test Summoner',
                riotIdTag: '1234',
            })

            const result = await service.getBasicInfo(server, riotId)

            expect(result).toBeDefined()
            expect(result.riotIdName).toEqual('Test Summoner')
            expect(result.riotIdTag).toEqual('1234')
        })

        it('should throw InternalServerErrorException when unable to parse response for puuid', async () => {
            const server = 'test_server'
            const riotId = { name: 'test_name', tag: 'test_tag' }

            jest.spyOn(service, 'getBasicInfo').mockRejectedValueOnce(new InternalServerErrorException())

            await expect(service.getBasicInfo(server, riotId)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('getRankData', () => {
        it('should return rank data when provided valid summoner_id and server', async () => {
            const summoner_id = 'test_summoner_id'
            const server = 'test_server'
            const expectedRankData = {
                solo: { rank: 'Gold II', image: 'gold.png', lp: 50, win: 100, lose: 80, winrate: 55 },
                flex: { rank: 'Silver III', image: 'silver.png', lp: 30, win: 70, lose: 60, winrate: 53 },
                arena: { rank: 'Unranked', image: 'unranked.png', lp: 0, win: 0, lose: 0, winrate: 0 },
            }

            jest.spyOn(service, 'getRankData').mockResolvedValueOnce(expectedRankData)

            const result = await service.getRankData(summoner_id, server)

            expect(result).toEqual(expectedRankData)
        })

        it('should throw InternalServerErrorException when unable to parse response for rank data', async () => {
            const summoner_id = 'test_summoner_id'
            const server = 'test_server'

            jest.spyOn(service, 'getRankData').mockRejectedValueOnce(new InternalServerErrorException())

            await expect(service.getRankData(summoner_id, server)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('isLastGame', () => {
        it('should return true when provided with valid server, puuid, and matchId', async () => {
            const server = 'test_server'
            const puuid = 'test_puuid'
            const matchId = 'test_matchId'
            const expectedResponse = { is_last: true, last_game_id: matchId }

            jest.spyOn(service, 'isLastGame').mockResolvedValueOnce(expectedResponse)

            const result = await service.isLastGame(server, puuid, matchId)

            expect(result).toEqual(expectedResponse)
        })

        it('should return false when provided with valid server, puuid, and matchId that does not match the last game', async () => {
            const server = 'test_server'
            const puuid = 'test_puuid'
            const matchId = 'test_matchId'
            const expectedResponse = { is_last: false, last_game_id: 'different_matchId' }

            jest.spyOn(service, 'isLastGame').mockResolvedValueOnce(expectedResponse)

            const result = await service.isLastGame(server, puuid, matchId)

            expect(result).toEqual(expectedResponse)
        })

        it('should throw InternalServerErrorException when unable to fetch game IDs', async () => {
            const server = 'test_server'
            const puuid = 'test_puuid'
            const matchId = 'test_matchId'

            jest.spyOn(service, 'isLastGame').mockRejectedValueOnce(new InternalServerErrorException())

            await expect(service.isLastGame(server, puuid, matchId)).rejects.toThrow(InternalServerErrorException)
        })

        it('should throw NotFoundException when unable to find game IDs for the provided puuid', async () => {
            const server = 'test_server'
            const puuid = 'test_puuid'
            const matchId = 'test_matchId'

            jest.spyOn(service, 'isLastGame').mockRejectedValueOnce(new NotFoundException())

            await expect(service.isLastGame(server, puuid, matchId)).rejects.toThrow(NotFoundException)
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })
})
