import { Controller, Get, Param } from '@nestjs/common'
import { Summoner } from 'src/interfaces'
import { SummonersService } from './summoners.service'

@Controller('summoners')
export class SummonersController {
    constructor(private readonly summonersService: SummonersService) {}

    @Get()
    async test(): Promise<string> {
        return await this.summonersService.getChampionName(420)
    }

    @Get('/:server')
    async getLeague(@Param('server') server: string): Promise<any> {
        return await this.summonersService.getGames(
            'f8qD2F6teQbeWoomTsCxtZoNoE3bUS45y0ZRlO2YnTGvEPcrAZ1kV3CI1PHaOTeK1FT_qxB6dneSMg',
            server,
        )
    }

    @Get('/:name')
    async getSummonerByName(@Param('name') name: string): Promise<Summoner> {
        console.log('ci')
        return await this.summonersService.getSummonerDataByName(name)
    }
}